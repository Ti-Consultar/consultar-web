
# MRP CONSULTAR - Front End

Dashboard e visualizador financeiro para grandes empresas. Permite consultas e análises de dados contábeis, financeiros e operacionais.

Tecnologias principais:
- React
- Material UI
- Axios
- React Router



## Instalação

Instale consultar-web com npm.

```bash
  git clone https://github.com/Ti-Consultar/consultar-web.git
  cd consultar-web
  npm install
  npm run dev
```
    
## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

VITE_API_URL_BASE="https://apiauth-hkcbffd9emhafhej.brazilsouth-01.azurewebsites.net/"

VITE_API_URL_MRP="https://mrpapi-fyedceapdygwbhhk.brazilsouth-01.azurewebsites.net/"

VITE_API_URL_CONSULTS="https://integratorapi-ebhhf0bydsacc7et.brazilsouth-01.azurewebsites.net/"


## Documentação

[Documentação](https://www.notion.so/ConsultarMRP-25c84234dcf780329c35c83f3aac8c1c?source=copy_link)

## Atualizacao automatica do app desktop

O aplicativo desktop usa `electron-updater` com provider `generic`. O
`electron-builder` gera estes arquivos em `release/`:

- `MRP Consultar Setup <versao>.exe`
- `MRP Consultar Setup <versao>.exe.blockmap`
- `latest.yml`

Os tres arquivos precisam ser publicados juntos na mesma pasta publica do
Azure Static Website. O app consulta `latest.yml`, compara com a versao do
`package.json`, baixa o instalador quando existir versao maior e mostra a
acao de reiniciar quando o download terminar.

### Configuracao no Azure Storage Static Website

1. Ative Static website no Storage Account.
2. Use a URL primaria do site com a pasta `desktop/`, por exemplo:
   `https://SEU_STORAGE_ACCOUNT.zXX.web.core.windows.net/desktop/`.
3. No GitHub, crie a variavel do repositorio `ELECTRON_UPDATE_URL` com essa
   URL final, incluindo a barra no final.
4. No GitHub, crie o secret `AZURE_STORAGE_CONNECTION_STRING` com a connection
   string do Storage Account.
5. Rode o workflow `Desktop Release` manualmente ou publique uma tag `v*`.

### Publicacao manual

```bash
npm run desktop:win
az storage blob upload-batch --source release --destination '$web' --destination-path windows --pattern "latest.yml" --overwrite true --content-type "text/yaml"
az storage blob upload-batch --source release --destination '$web' --destination-path windows --pattern "*.exe" --overwrite true --content-type "application/vnd.microsoft.portable-executable"
az storage blob upload-batch --source release --destination '$web' --destination-path windows --pattern "*.blockmap" --overwrite true --content-type "application/octet-stream"
```

Sempre aumente a versao em `package.json` antes de publicar uma nova build
desktop. Usuarios que instalaram uma versao antiga sem auto-updater precisam
instalar manualmente esta primeira versao com updater; a partir dela, as
proximas atualizacoes passam a ser detectadas automaticamente.


## Autores
- [@Weverton Oliveira](https://github.com/tomoliveira1)


## Contribuindo

Se você é um novo Dev Consultar, seja bem-vindo!

Este é um projeto privado, consulte a documentação e se sinta livre para buscar suporte com outros devs do projeto.

Por favor, siga o `código de conduta` desse projeto.


## Licença

© ConsultarMRP – Todos os direitos reservados. A reprodução ou cópia deste produto é proibida por lei e sujeita a penalidades.

