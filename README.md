# Projeto WebGIS

Este é um projeto WebGIS que visa [insira aqui uma breve descrição do propósito do projeto, como por exemplo, visualizar dados geoespaciais em um ambiente web interativo].

## Instruções para Execução

Siga os passos abaixo para executar a aplicação:

1. Abra o Anaconda Prompt.

2. Se ainda não tiver, crie um ambiente virtual conda executando o seguinte comando:

    ```bash
    conda create -n nome_do_ambiente
    ```

3. Ative o ambiente virtual:

    ```bash
    conda activate nome_do_ambiente
    ```

4. Navegue até a pasta do projeto. Por exemplo:

    ```bash
    cd E:\Projetos\Proj_WebGIS
    ```

5. Instale as dependências do projeto usando o arquivo `requirements.txt`:

    ```bash
    pip install -r requirements.txt
    ```

6. Execute as migrações para garantir que todos os dados estejam no banco:

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

7. Inicie a aplicação:

    ```bash
    python manage.py runserver
    ```

A aplicação estará disponível em [http://localhost:8000/](http://localhost:8000/).

## Contribuindo

Se desejar contribuir para o projeto, siga as práticas de contribuição. Abra uma issue para relatar problemas ou sugestões.

Aproveite o desenvolvimento!
