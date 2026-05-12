# Icones desktop

Adicione os icones da versao desktop nesta pasta antes de gerar os instaladores.

## Arquivos esperados

- `build/icon.ico`: Windows, usado pelo instalador e executavel.
- `build/icon.icns`: macOS, usado pelo bundle `.app`.
- `build/icon.png`: PNG principal opcional, usado como fallback pela janela do Electron.
- `build/icons/512x512.png`: Linux e icone da janela em Windows/Linux.
- `build/icons/256x256.png`
- `build/icons/128x128.png`
- `build/icons/64x64.png`
- `build/icons/48x48.png`
- `build/icons/32x32.png`
- `build/icons/16x16.png`

O `electron-builder` usa `build/icon.ico`, `build/icon.icns` e a pasta `build/icons` conforme a plataforma selecionada.
