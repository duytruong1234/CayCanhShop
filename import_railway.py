"""Import local database directly to Railway PostgreSQL"""
import psycopg2

LOCAL_URL = "postgresql://postgres:123@localhost:5432/HeThongBanCayCanh"
RAILWAY_URL = "postgresql://postgres:wiAMNPcOkVMzcjgQUhHvKQkDdqaCjXDh@shinkansen.proxy.rlwy.net:34443/railway"

# Connect to both databases
print("Connecting to local database...")
local = psycopg2.connect(LOCAL_URL)
local_cur = local.cursor()

print("Connecting to Railway...")
remote = psycopg2.connect(RAILWAY_URL, sslmode='require')
remote.autocommit = True
remote_cur = remote.cursor()
print("Both connected!\n")

# Fix schema permissions
remote_cur.execute("CREATE SCHEMA IF NOT EXISTS public")
remote_cur.execute("GRANT ALL ON SCHEMA public TO postgres")
remote_cur.execute("GRANT ALL ON SCHEMA public TO public")

# Get all tables from local
local_cur.execute("""
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
""")
tables = [r[0] for r in local_cur.fetchall()]
print(f"Found {len(tables)} tables in local database\n")

# Drop existing tables on Railway (reverse order to respect FK)
for t in reversed(tables):
    try:
        remote_cur.execute(f'DROP TABLE IF EXISTS "{t}" CASCADE')
    except:
        pass

# Get full DDL for each table and recreate
for table in tables:
    # Get columns
    local_cur.execute(f"""
        SELECT column_name, data_type, character_maximum_length,
               is_nullable, column_default, numeric_precision, numeric_scale,
               udt_name
        FROM information_schema.columns
        WHERE table_name = '{table}' AND table_schema = 'public'
        ORDER BY ordinal_position
    """)
    columns = local_cur.fetchall()
    
    # Get primary key
    local_cur.execute(f"""
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = '{table}' AND tc.constraint_type = 'PRIMARY KEY'
        ORDER BY kcu.ordinal_position
    """)
    pk_cols = [r[0] for r in local_cur.fetchall()]
    
    col_defs = []
    for col_name, data_type, char_max_len, is_nullable, col_default, num_prec, num_scale, udt_name in columns:
        if col_default and 'nextval' in str(col_default):
            if data_type == 'bigint':
                type_str = 'BIGSERIAL'
            else:
                type_str = 'SERIAL'
        elif data_type == 'character varying':
            type_str = f'VARCHAR({char_max_len})' if char_max_len else 'VARCHAR(255)'
        elif data_type == 'numeric':
            type_str = f'NUMERIC({num_prec},{num_scale})' if num_prec else 'NUMERIC'
        elif udt_name == 'float8':
            type_str = 'DOUBLE PRECISION'
        else:
            type_str = data_type.upper()
            
        nullable = '' if is_nullable == 'YES' else ' NOT NULL'
        default_str = ''
        if col_default and 'nextval' not in str(col_default):
            default_str = f" DEFAULT {col_default}"
        if 'SERIAL' in type_str:
            nullable = ''
            default_str = ''
            
        col_defs.append(f'    "{col_name}" {type_str}{nullable}{default_str}')
    
    if pk_cols:
        pk_str = ', '.join(f'"{c}"' for c in pk_cols)
        col_defs.append(f'    PRIMARY KEY ({pk_str})')
    
    create_sql = f'CREATE TABLE "{table}" (\n' + ',\n'.join(col_defs) + '\n)'
    
    try:
        remote_cur.execute(create_sql)
        print(f"  Created: {table}")
    except Exception as e:
        print(f"  FAILED: {table} -> {str(e).strip().split(chr(10))[0][:80]}")
        continue
    
    # Copy data
    local_cur.execute(f'SELECT * FROM "{table}"')
    rows = local_cur.fetchall()
    if rows:
        col_names = [desc[0] for desc in local_cur.description]
        cols = ', '.join(f'"{c}"' for c in col_names)
        placeholders = ', '.join(['%s'] * len(col_names))
        insert_sql = f'INSERT INTO "{table}" ({cols}) VALUES ({placeholders})'
        
        for row in rows:
            try:
                remote_cur.execute(insert_sql, row)
            except Exception as e:
                print(f"    Insert error {table}: {str(e).strip().split(chr(10))[0][:60]}")
                break
        
        # Reset serial sequence
        for col_name, data_type, char_max_len, is_nullable, col_default, num_prec, num_scale, udt_name in columns:
            if col_default and 'nextval' in str(col_default):
                try:
                    remote_cur.execute(f"""
                        SELECT setval(pg_get_serial_sequence('"{table}"', '{col_name}'), 
                               COALESCE((SELECT MAX("{col_name}") FROM "{table}"), 1))
                    """)
                except:
                    pass
        
        print(f"    -> {len(rows)} rows")

# Add foreign keys
print("\nAdding foreign keys...")
local_cur.execute("""
    SELECT tc.table_name, tc.constraint_name, kcu.column_name,
           ccu.table_name AS ref_table, ccu.column_name AS ref_column
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
""")
fks = local_cur.fetchall()
for table, fk_name, col, ref_table, ref_col in fks:
    try:
        remote_cur.execute(f'ALTER TABLE "{table}" ADD CONSTRAINT "{fk_name}" FOREIGN KEY ("{col}") REFERENCES "{ref_table}" ("{ref_col}")')
        print(f"  FK: {table}.{col} -> {ref_table}.{ref_col}")
    except Exception as e:
        err = str(e).strip().split(chr(10))[0][:60]
        print(f"  FK skip: {table}.{col} ({err})")

# Final verification
print("\n" + "=" * 50)
print("VERIFICATION")
print("=" * 50)
remote_cur.execute("""
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
""")
rtables = [r[0] for r in remote_cur.fetchall()]
print(f"Tables on Railway: {len(rtables)}")
total_rows = 0
for t in rtables:
    remote_cur.execute(f'SELECT COUNT(*) FROM "{t}"')
    count = remote_cur.fetchone()[0]
    total_rows += count
    print(f"  {t}: {count} rows")

print(f"\nTotal: {len(rtables)} tables, {total_rows} rows")

local.close()
remote.close()
print("\nDone!")
