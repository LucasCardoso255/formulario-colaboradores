import pandas as pd
import re

df = pd.read_excel('planilha_atualizada.xlsx')

def get_embalagem_unidade(descricao):
    if '150-' in descricao:
        return 'PA 04625'
    if '100-' in descricao:
        return 'PA 02232'
    if '250-' in descricao:
        return 'PA 02228'
    return ''

def get_embalagem_caixa(descricao):
    if '250-' in descricao:
        return 'PA 01878'
    if '150-' in descricao:
        return 'PA 02004'
    if '100-' in descricao:
        return 'PA 02003'
    return ''

def extract_numero(descricao):
    match = re.search(r'(\d+-\d+)', descricao)
    return match.group(1) if match else ''

def extract_cor(descricao):
    descricao = descricao.lower()
    if ' br' in descricao:
        return 'br'
    if ' pr' in descricao:
        return 'pr'
    if ' cz' in descricao:
        return 'cz'
    if ' jt' in descricao:
        return 'jt'
    return ''

def get_tinta_por_cor(cor):
    if cor == 'br':
        return 'PA 02067'
    if cor == 'pr':
        return 'PA 03108'
    if cor == 'cz':
        return 'PA 03815'
    return None

produtos_unidade = df[df['Descricao do produto'].str.contains('(Unidade)', regex=False)].set_index('Descricao do produto')
lista_explodida = []

for _, row in df.iterrows():
    codigo_produto = row['Codigo do produto']
    descricao = row['Descricao do produto']
    peso = row['Peso bruto unitario'] if pd.isna(row['Peso bruto unitario']) else row['Peso liquido unitario']
    numero_lista = extract_numero(descricao)
    cor_lista = extract_cor(descricao)
    nome_lista = f'Lista padrão {numero_lista} {cor_lista}'
    produto_original = descricao

    if '(Unidade)' in descricao:
        lista_explodida.append({
            'Código do produto pai': codigo_produto,
            'Nome da lista': nome_lista,
            'Descrição da lista': nome_lista,
            'Qtde base': 1,
            'Código do produto filho': 'MP 00001',
            'Qtde de peças': peso,
            'Posição': 1,
            'Produto Original': produto_original
        })

        embalagem = get_embalagem_unidade(descricao)
        if embalagem:
            lista_explodida.append({
                'Código do produto pai': codigo_produto,
                'Nome da lista': nome_lista,
                'Descrição da lista': nome_lista,
                'Qtde base': 1,
                'Código do produto filho': embalagem,
                'Qtde de peças': 1,
                'Posição': 2,
                'Produto Original': produto_original
            })

        tinta = get_tinta_por_cor(cor_lista)
        if tinta:
            lista_explodida.append({
                'Código do produto pai': codigo_produto,
                'Nome da lista': nome_lista,
                'Descrição da lista': nome_lista,
                'Qtde base': 1,
                'Código do produto filho': tinta,
                'Qtde de peças': 1,
                'Posição': 3,
                'Produto Original': produto_original
            })

    elif '(Caixa com 6)' in descricao:
        descricao_unidade = descricao.replace('(Caixa com 6)', '(Unidade)').strip()
        if descricao_unidade in produtos_unidade.index:
            codigo_unidade = produtos_unidade.loc[descricao_unidade, 'Codigo do produto']
            lista_explodida.append({
                'Código do produto pai': codigo_produto,
                'Nome da lista': nome_lista,
                'Descrição da lista': nome_lista,
                'Qtde base': 1,
                'Código do produto filho': codigo_unidade,
                'Qtde de peças': 6,
                'Posição': 1,
                'Produto Original': produto_original
            })

        embalagem = get_embalagem_caixa(descricao)
        if embalagem:
            lista_explodida.append({
                'Código do produto pai': codigo_produto,
                'Nome da lista': nome_lista,
                'Descrição da lista': nome_lista,
                'Qtde base': 1,
                'Código do produto filho': embalagem,
                'Qtde de peças': 1,
                'Posição': 2,
                'Produto Original': produto_original
            })

df_explodido = pd.DataFrame(lista_explodida)
df_explodido.to_excel('lista_produtos_organizados.xlsx', index=False)

print("Arquivo final gerado: 'lista_produtos_organizados.xlsx'.")