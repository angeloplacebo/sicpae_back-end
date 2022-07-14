# sicpae_back-end

SICPAE(back-end) - sistema inteligente para controle de presença em ambientes de estudo



### Server info

##### Main Server:

> ​	base_url: http://localhost:3000/api/v1/records/
>
> ​	start_cmd: yarn dev

##### Auth Server


> ​	base_url: http://localhost:3001/api/v1/user/
>
> ​	start_cmd: yarn dev_auth

--------------


#### dotenv info:

- create .env file
- example:

 ```bash
 PORT=3000
 AUTH_PORT=3001

 DATABASE_URL=mongodb+srv://<username>:<password>@cluster00.jmgf0.mongodb.net/?retryWrites=true&w=majority

 ACCESS_TOKEN_SECRET=hash_secret
 REFRESH_TOKEN_SECRET=hash_secret
 ```

