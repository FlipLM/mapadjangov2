Para executar a aplicação siga os passos:

1. Executar o Anaconda Prompt
2. Criar ambiente virtual conda (caso ainda não tenha)

	conda create -n nome_do_ambiente

3. Ativar o ambiente virtual

	conda activate nome_do_ambiente

4. Navegar até a pasta do projeto, por exemplo:
	
	cd E:\Projetos\Proj_ArquiteturaSoftware

5. Instalar as dependências do projeto (utilize o arquivo requirements.txt)

	pip install - r requirements.txt

6. Importante fazer o makemigrations e migrate, para garantir que todos os dados estão no banco

	python manage.py makemigrations
	python manage.py migrate

7. Executar a aplicação

	python manage.py runserver