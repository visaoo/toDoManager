const StatusEnum = {
      PENDENTE: 'pendente',
      CONCLUIDA: 'concluida'
}

const users = [
      { id: 1, nome: 'Fulano', email: 'fulano@email.com', senha: 'senha123' },
      { id: 2, nome: 'Ciclano', email: 'ciclano@email.com', senha: 'senha456' },
      { id: 3, nome: 'Beltrano', email: 'beltrano@email.com', senha: 'senha789' }
]

const todos = [
        { id: 1, usuarioId: 1, titulo: 'Fazer café', status: StatusEnum.PENDENTE },
        { id: 2, usuarioId: 1, titulo: 'Estudar JavaScript', status: StatusEnum.CONCLUIDA },
        { id: 3, usuarioId: 2, titulo: 'Fazer compras', status: StatusEnum.PENDENTE }
]