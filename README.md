![coverage](/badge.svg)

# Pingado-Server

_backend stack_ para desenvolvimento rápido de aplicações web.

## Caracteristicas

  - Assíncrono ([Bluebird](https://github.com/petkaantonov/bluebird))
  - configuração de aplicação através variáveis de ambiente locais com dotenv;
  - elaboração de REST api com express 4.*;
  - Integração com base de dados ([Mongoose](http://mongoosejs.com/) por padrão);
  - templates com [pug.js](https://github.com/pugjs)
  - _Asset pipeline_ com [connect-assets](https://github.com/TrevorBurnham/connect-assets);
  - registro de atividade (log) e exceções;

## Instalar

    git clone https://www.github.com/lunhg/pingado.git
	npm install

## Configuração

Crie um arquivo `.env` na pasta raiz do seu projeto como o a seguir. 


    CAFE_RAILS_PORT=3000
    CAFE_RAILS_LOGGER=':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent'
    CAFE_RAILS_VIEWS='%ROOT/app/views'
    CAFE_RAILS_ENGINE='pug'
    CAFE_RAILS_PUBLIC='%ROOT/app/assets'
    CAFE_RAILS_IMAGE='%ROOT/app/assets/images'
    CAFE_RAILS_FONTS='%ROOT/app/assets/fonts'
    CAFE_RAILS_STYLES='%ROOT/app/assets/css'
    CAFE_RAILS_SCRIPTS='%ROOT/app/assets/js'
    CAFE_RAILS_COVERAGE='%ROOT/coverage/lcov-report'
    CAFE_RAILS_DOCUMENTATION='%ROOT/app/assets/doc'
	BLUEBIRD_LONG_STACK_TRACES=1 
	BLUEBIRD_WARNINGS=1

Variáveis:

  - `%ROOT`: macro de substituição do diretório de execução atual (`process.cwd()`)
  - `CAFE_RAILS_PORT`: porta de execução do servidor
  - `CAFE_RAILS_LOGGER`: formato de registro dos acessos
  - `CAFE_RAILS_VIEWS`: pasta onde estão localizados os templates html 
  - `CAFE_RAILS_ENGINE`: motor utilizado para converter os templates html
  - `CAFE_RAILS_PUBLIC`: pasta onde estão localizados os arquivos públicos 
  - `CAFE_RAILS_IMAGE`: pasta onde estão localizados os arquivos de imagem
  - `CAFE_RAILS_FONTS`: pasta onde estão localizados os arquivos de imagem
  - `CAFE_RAILS_STYLES`: pasta onde estão localizados os arquivos de estilos
  - `CAFE_RAILS_SCRIPTS`: pasta onde estão localizados os arquivos de javascript
  - `CAFE_RAILS_SCRIPTS`: pasta onde estão localizados os code-coverages
  - `CAFE_RAILS_SCRIPTS`: pasta onde estão localizados os arquivos de documentação
  - `BLUEBIRD_LONG_STACK`:habilita reportação de erros nas promessas 
  - `BLUEBIRD_WARNINGS`: idem
  

## Testar

	npm test

Isso executará um servidor teste em http://localhost:3000 que irá testar:

- GET /
- POST /
