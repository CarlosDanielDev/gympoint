<h1 align="center">
  <img alt="Gympoint" title="Gympoint" src="gympoint.png" width="200px" />
</h1>

# Gympoint

Gympoint- Serviços de gerenciamento de academias.

## Instalação

Use o git clone [git](https://github.com/DanPHP7/gympoint/) para clonar a Gympoint.

```bash
git clone https://github.com/DanPHP7/gympoint.git
```

## Run

```bash
yarn && yarn dev
```

## Contribuição

Pull requests são bem-vindas. Qualquer erro, ou sejestão de corrção sinta-se livre para clonar, commitar e mandar a PR.

contato: **_<danphp7@gmail.com>_**

## Include example

```js
import Students from '../models/Students';
import User from '../models/User';

const { page = 1, q } = req.query;

const { gym_id } = await User.findOne({
  where: { id: req.userId },
  attributes: ['gym_id']
});

const query = q ? { name: { [Op.like]: `%${q}%` } } : {};

const students = await Students.findAll({
  where: { ...query, gym_id },
  attributes: ['id', 'name', 'age', 'gym_id', 'createdAt', 'updatedAt'],
  include: [
    {
      model: Gyms,
      as: 'gym',
      where: { id: gym_id },
      attributes: ['name', 'cnpj']
    }
  ],
  limit: 15,
  offset: (page - 1) * 15
});
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
