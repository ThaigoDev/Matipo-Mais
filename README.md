# Matipó Mais

Bem-vindo ao repositório do **Matipó Mais**! Este projeto é um site de utilidade pública desenvolvido por acadêmicos do 4º período da faculdade Univértix. Nosso objetivo é registrar e divulgar os melhores comércios e empresas que servem a população de Matipó, incluindo lanchonetes, farmácias, instituições de educação, entre outros.

## Tecnologias Utilizadas

### Front-End
- HTML5
- CSS3
- JavaScript
- EJS (Embedded JavaScript)
- JQuery
- Bootstrap
- Tailwind CSS

### Back-End
- Node.js
- TypeScript
- Express.js
- PostgreSQL 16 (via Docker)
- node-postgres (pg)

## Funcionalidades

- Listagem de comércios e empresas por categoria
- Pesquisa por nome ou categoria
- Detalhamento de cada comércio/empresa
- Cadastro, edição e exclusão de comércios/empresas (restrito a administradores)
- Sistema de login e autenticação para administradores

## Estrutura do Projeto

- `/public` - Arquivos estáticos (CSS, JS, imagens)
- `/views` - Templates EJS
- `/routes` - Definição de rotas do Express.js
- `/models` - Modelos de dados (PostgreSQL); esquema em `/db/schema.sql`
- `/controllers` - Lógica de controle do aplicativo

## Como Executar o Projeto

1. Clone o repositório:
    ```sh
    git clone https://github.com/seu-usuario/matipo-mais.git
    ```

2. Navegue até o diretório do projeto:
    ```sh
    cd matipo-mais
    ```

3. Instale as dependências:
    ```sh
    npm install
    ```

4. Configure as variáveis de ambiente copiando o exemplo e trocando as senhas:
    ```sh
    cp .env.example .env
    ```

5. Suba o PostgreSQL no Docker:
    ```sh
    npm run db:up
    ```

6. Crie a conta de administrador (usa `ADMIN_EMAIL` e `ADMIN_PASSWORD` do `.env`):
    ```sh
    npm run seed:admin
    ```

7. Inicie o servidor (as tabelas são criadas automaticamente):
    ```sh
    npm start
    ```

8. Abra seu navegador e acesse `http://localhost:3000`

## Contribuindo

Se você deseja contribuir com o projeto, siga estas etapas:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Commit suas mudanças (`git commit -m 'Adicionei uma nova feature'`)
4. Faça o push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## Contato

Para mais informações, entre em contato com a equipe de desenvolvimento pelo e-mail: [contato@matipomais.com](mailto:contato@matipomais.com).

---

Desenvolvido por acadêmicos do 4º período da faculdade Univértix.
