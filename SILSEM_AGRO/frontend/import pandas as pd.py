import pandas as pd

# Load the Excel file
df = pd.read_excel('"D:\softwares\MAY-AUG 2025 VOL1-STUDENTS COPY.xlsx"', engine='openpyxl')

# Character to scan for
target_char = '@koila lesiamon nicholas'

# Scan all cells in the DataFrame
for row_index, row in df.iterrows():
    for col in df.columns:
        cell_value = str(row[col])
        if target_char in cell_value:
            print(f"Found '{target_char}' in row {row_index + 1}, column '{col}': {cell_value}")
