//Por lo general estos datos deben venir de variables de ambiente (.env),
//se deja así porque es requisito para la prueba
export default {
  port: 3333,
  toolbox: {
    apiKey: 'aSuperSecretKey',
    baseUrl: 'https://echo-serv.tbxnet.com/v1/secret',
  },
}
