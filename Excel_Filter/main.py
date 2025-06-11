import pandas as pd
import re

def get_packaging_item_code(description):
    if '150-' in description:
        return 'PA 04625'
    if '100-' in description:
        return 'PA 02232'
    if '250-' in description:
        return 'PA 02228'
    return None

def get_box_packaging_item_code(description):
    if '250-' in description:
        return 'PA 01878'
    if '150-' in description:
        return 'PA 02004'
    if '100-' in description:
        return 'PA 02003'
    return None

def extract_number(description):
    match = re.search(r'(\d+-\d+)', description)
    return match.group(1) if match else ''

def extract_color(description):
    description = description.lower()
    if ' br' in description:
        return 'br'
    if ' pr' in description:
        return 'pr'
    if ' cz' in description:
        return 'cz'
    if ' jt' in description:
        return 'jt'
    return ''

def get_paint_item_code_by_color(color):
    if color == 'br':
        return 'PA 02067'
    if color == 'pr':
        return 'PA 03108'
    if color == 'cz':
        return 'PA 03815'
    return None

def process_product_data(df):
    exploded_list = []
    
    products_by_description = df.set_index('Descricao do produto')

    for _, row in df.iterrows():
        product_code = row['Codigo do produto']
        description = row['Descricao do produto']
        weight = row['Peso bruto unitario'] if pd.notna(row['Peso bruto unitario']) else row['Peso liquido unitario']
        
        extracted_number = extract_number(description)
        extracted_color = extract_color(description)
        list_name = f'Lista padrão {extracted_number} {extracted_color}'
        original_product = description

        base_entry = {
            'Código do produto pai': product_code,
            'Nome da lista': list_name,
            'Descrição da lista': list_name,
            'Qtde base': 1,
            'Produto Original': original_product
        }

        if '(Unidade)' in description:
            exploded_list.append({
                **base_entry,
                'Código do produto filho': 'MP 00001',
                'Qtde de peças': weight,
                'Posição': 1
            })

            packaging_item_code = get_packaging_item_code(description)
            if packaging_item_code:
                exploded_list.append({
                    **base_entry,
                    'Código do produto filho': packaging_item_code,
                    'Qtde de peças': 1,
                    'Posição': 2
                })

            paint_item_code = get_paint_item_code_by_color(extracted_color)
            if paint_item_code:
                exploded_list.append({
                    **base_entry,
                    'Código do produto filho': paint_item_code,
                    'Qtde de peças': 1,
                    'Posição': 3
                })

        elif '(Caixa com 6)' in description:
            unit_description = description.replace('(Caixa com 6)', '(Unidade)').strip()
            if unit_description in products_by_description.index:
                unit_product_code = products_by_description.loc[unit_description, 'Codigo do produto']
                exploded_list.append({
                    **base_entry,
                    'Código do produto filho': unit_product_code,
                    'Qtde de peças': 6,
                    'Posição': 1
                })

            box_packaging_item_code = get_box_packaging_item_code(description)
            if box_packaging_item_code:
                exploded_list.append({
                    **base_entry,
                    'Código do produto filho': box_packaging_item_code,
                    'Qtde de peças': 1,
                    'Posição': 2
                })
    
    return pd.DataFrame(exploded_list)

df = pd.read_excel('planilha_atualizada.xlsx')

df_exploded = process_product_data(df)

output_filename = 'lista_produtos_organizados.xlsx'
writer = pd.ExcelWriter(output_filename, engine='xlsxwriter')
df_exploded.to_excel(writer, sheet_name='Produtos', index=False)

workbook = writer.book
worksheet = writer.sheets['Produtos']

for i, col in enumerate(df_exploded.columns):
    max_len = max(df_exploded[col].astype(str).map(len).max(), len(col)) + 2
    worksheet.set_column(i, i, max_len)

writer.close()

print(f"Arquivo final gerado: '{output_filename}'.")