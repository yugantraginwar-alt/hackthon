import math
from typing import Tuple, Optional
from .brands import LEGITIMATE_BRANDS

# Homoglyph map for visual spoofing
HOMOGLYPHS = {
    '0': 'o', '1': 'l', 'l': 'i', 'vv': 'w', 'rn': 'm', 'cl': 'd'
}

def normalize_homoglyphs(s: str) -> str:
    norm = s.lower()
    for spoof, target in HOMOGLYPHS.items():
        norm = norm.replace(spoof, target)
    return norm

def levenshtein_distance(s1: str, s2: str) -> int:
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

def jaro_winkler_similarity(s1: str, s2: str) -> float:
    # Jaro Similarity
    len1, len2 = len(s1), len(s2)
    if len1 == 0 and len2 == 0:
        return 1.0
    if len1 == 0 or len2 == 0:
        return 0.0

    match_distance = max(len1, len2) // 2 - 1
    s1_matches = [False] * len1
    s2_matches = [False] * len2
    matches = 0
    transpositions = 0

    for i in range(len1):
        start = max(0, i - match_distance)
        end = min(i + match_distance + 1, len2)
        for j in range(start, end):
            if s2_matches[j]:
                continue
            if s1[i] != s2[j]:
                continue
            s1_matches[i] = True
            s2_matches[j] = True
            matches += 1
            break

    if matches == 0:
        return 0.0

    k = 0
    for i in range(len1):
        if not s1_matches[i]:
            continue
        while not s2_matches[k]:
            k += 1
        if s1[i] != s2[k]:
            transpositions += 1
        k += 1

    transpositions //= 2
    jaro = (matches / len1 + matches / len2 + (matches - transpositions) / matches) / 3.0

    # Winkler modification
    prefix = 0
    max_prefix = min(4, min(len1, len2))
    for i in range(max_prefix):
        if s1[i] == s2[i]:
            prefix += 1
        else:
            break

    scaling = 0.1
    return jaro + (prefix * scaling * (1.0 - jaro))

def check_typosquatting(domain: str) -> Tuple[bool, Optional[str], float]:
    """
    Checks if domain is a typosquatted variant of any legitimate brand.
    Returns: (is_typosquatted, matched_brand, similarity_score)
    """
    clean_domain = domain.lower().split(":")[0]
    
    # Exact legitimate match -> safe
    if clean_domain in LEGITIMATE_BRANDS:
        return False, clean_domain, 1.0

    domain_core = clean_domain.split(".")[0]
    norm_domain = normalize_homoglyphs(domain_core)

    best_match = None
    highest_sim = 0.0

    for brand in LEGITIMATE_BRANDS:
        brand_core = brand.split(".")[0]
        norm_brand = normalize_homoglyphs(brand_core)

        # Direct inclusion or subpart with hypehn/trick (e.g. sbi-kyc, bank-examp1e)
        if brand_core in clean_domain and clean_domain != brand:
            return True, brand, 0.95

        # Check homoglyph match
        if norm_domain == norm_brand and domain_core != brand_core:
            return True, brand, 0.98

        # Jaro-Winkler similarity
        sim = jaro_winkler_similarity(domain_core, brand_core)
        lev = levenshtein_distance(domain_core, brand_core)

        if sim > 0.82 and (lev <= 2 or sim > 0.88):
            if sim > highest_sim:
                highest_sim = sim
                best_match = brand

    if best_match and highest_sim >= 0.82:
        return True, best_match, highest_sim

    return False, None, 0.0
