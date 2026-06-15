# Pet Wallet

Aplicação de controle de pets para cães e gatos.

Funcionalidades:
- Cadastro de pet com dados do dono e endereço
- Registro de vacinas aplicadas e próxima data de vacina
- Controle de alerta de vacina com antecedência configurável
- Registro de banho e tosa
- Registro de serviços externos com horário, local e contato
- Visualização, edição e exclusão de pets

Como usar:
1. `npm install`
2. `npm run dev`
3. Acesse `http://localhost:3001`

Estrutura:
- `index.js`
- `src/config` - configuração do banco e ORM
- `src/controllers` - lógica de CRUD
- `src/models` - modelo Sequelize
- `src/routers` - rotas Express
- `src/views` - templates EJS
- `src/public` - arquivos estáticos
- `.env` - porta e host
