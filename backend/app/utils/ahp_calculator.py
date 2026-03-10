"""
AHP Calculator Module
Implements the Analytic Hierarchy Process algorithm for calculating weights and consistency ratio.
"""
import numpy as np
from typing import List, Dict, Tuple

# Random Index values for matrices of size 1-10
RI_VALUES = {
    1: 0.00, 2: 0.00, 3: 0.58, 4: 0.90, 5: 1.12,
    6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49
}


def calculate_weights(matrix: List[List[float]]) -> List[float]:
    """
    Calculate priority weights from a pairwise comparison matrix using the Column Sum Normalization method.
    
    Steps:
        1. Sum each column of the matrix
        2. Divide each element by its column sum (normalize)
        3. Average each row to get the priority weight
    
    Args:
        matrix: NxN pairwise comparison matrix
        
    Returns:
        List of normalized weights that sum to 1
    """
    n = len(matrix)
    if n == 0:
        return []
    
    arr = np.array(matrix)
    
    # Column Sum Normalization method (matches Excel/standard AHP textbook approach)
    # Step 1: Sum each column
    col_sums = arr.sum(axis=0)
    
    # Step 2: Normalize (divide each element by its column sum)
    # Avoid division by zero
    col_sums = np.where(col_sums == 0, 1, col_sums)
    normalized = arr / col_sums
    
    # Step 3: Average each row to get the weight
    weights = normalized.mean(axis=1)
    
    return weights.tolist()


def calculate_cr(matrix: List[List[float]], weights: List[float]) -> float:
    """
    Calculate Consistency Ratio (CR) for a pairwise comparison matrix.
    
    CR < 0.1 indicates acceptable consistency.
    
    Args:
        matrix: NxN pairwise comparison matrix
        weights: Calculated priority weights
        
    Returns:
        Consistency Ratio (CR) value
    """
    n = len(matrix)
    if n <= 2:
        return 0.0  # CR is not meaningful for n <= 2
    
    arr = np.array(matrix)
    w = np.array(weights)
    
    # Calculate λmax (largest eigenvalue)
    weighted_sum = arr @ w
    
    # Avoid division by zero
    with np.errstate(divide='ignore', invalid='ignore'):
        ratios = np.divide(weighted_sum, w)
        # Filter out infinity or nan values which result from w[i] being 0
        valid_ratios = ratios[np.isfinite(ratios)]
    
    if len(valid_ratios) == 0:
        return 0.0
        
    lambda_max = np.mean(valid_ratios)
    
    # Consistency Index
    ci = (lambda_max - n) / (n - 1)
    
    # Random Index
    ri = RI_VALUES.get(n, 1.49)  # Use 1.49 for n > 10
    
    # Consistency Ratio
    cr = ci / ri if ri > 0 else 0.0
    
    return max(0, float(cr))  # CR cannot be negative


def calculate_final_scores(
    selected_criteria: List[str],
    criteria_weights: Dict[str, float],
    plant_weights: Dict[str, Dict[int, float]]
) -> Dict[int, float]:
    """
    Calculate final AHP scores for plants based on selected criteria.
    
    Args:
        selected_criteria: List of criteria codes selected by user (e.g., ['C1', 'C3'])
        criteria_weights: Dict mapping criteria code to its weight (e.g., {'C1': 0.5, 'C2': 0.1})
        plant_weights: Dict mapping criteria code to plant weights 
                       (e.g., {'C1': {1: 0.2, 2: 0.3}, 'C2': {1: 0.15, 2: 0.25}})
    
    Returns:
        Dict mapping plant ID to final score (0-100%)
    """
    # Get all plant IDs from any criterion
    all_plant_ids = set()
    for criterion in selected_criteria:
        if criterion in plant_weights:
            all_plant_ids.update(plant_weights[criterion].keys())
    
    if not all_plant_ids:
        return {}
    
    # Normalize criteria weights for selected criteria only
    total_weight = sum(criteria_weights.get(c, 0) for c in selected_criteria)
    if total_weight == 0:
        total_weight = 1
    
    normalized_criteria_weights = {
        c: criteria_weights.get(c, 0) / total_weight for c in selected_criteria
    }
    
    # Calculate final scores
    final_scores = {}
    for plant_id in all_plant_ids:
        score = 0.0
        for criterion in selected_criteria:
            crit_weight = normalized_criteria_weights.get(criterion, 0)
            plant_weight = plant_weights.get(criterion, {}).get(plant_id, 0)
            score += crit_weight * plant_weight
        
        # Convert to percentage (0-100)
        final_scores[plant_id] = round(score * 100, 1)
    
    return final_scores


def matrix_to_dict(matrix: List[List[float]], row_ids: List, col_ids: List) -> Dict:
    """
    Convert a matrix to a dictionary format suitable for JSON response.
    
    Args:
        matrix: NxN matrix
        row_ids: List of row identifiers
        col_ids: List of column identifiers
        
    Returns:
        Dictionary with row_id -> col_id -> value structure
    """
    result = {}
    for i, row_id in enumerate(row_ids):
        result[row_id] = {}
        for j, col_id in enumerate(col_ids):
            result[row_id][col_id] = round(matrix[i][j], 4)
    return result
