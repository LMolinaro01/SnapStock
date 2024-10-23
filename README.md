# SnapStock - Aplicativo de Gerenciamento de Estoque

O **SnapStock** é uma aplicação móvel desenvolvida em **React Native** para facilitar o gerenciamento de estoques de forma prática e intuitiva. O sistema permite que os usuários adicionem, visualizem e gerenciem produtos de maneira eficiente, garantindo a persistência de dados e segurança de informações sensíveis.

## Exibição

![image](https://github.com/user-attachments/assets/c7b17041-94e4-436a-b5bc-ce8dcef73f6d)
![image](https://github.com/user-attachments/assets/37823503-c6a0-4138-8a51-80cb7c2676a3)
![image](https://github.com/user-attachments/assets/8c322091-110d-4062-891e-ca571d63af97)
![image](https://github.com/user-attachments/assets/e31f8f11-ee26-45c7-9d1c-0496131aa4b1)
![image](https://github.com/user-attachments/assets/3fb0d2c5-4991-4daa-8dc0-45af35c4d6aa)
![image](https://github.com/user-attachments/assets/431d7cad-0ebb-4a80-9a29-c7b3df70d130)
![image](https://github.com/user-attachments/assets/d574ae69-6b6d-486d-80da-348d6134ebe6)
![image](https://github.com/user-attachments/assets/1f11d782-8318-4be7-b420-69b54994b321)

## Funcionalidades

### 1. **Login Seguro**
O SnapStock oferece um sistema de login seguro, utilizando **criptografia** para proteger as credenciais dos usuários. As senhas são criptografadas com o algoritmo **SHA-256** através da biblioteca **CryptoJS**, garantindo que as informações sensíveis sejam protegidas, mesmo que armazenadas localmente.

### 2. **Gerenciamento de Sessões**
Após o login bem-sucedido, uma **sessão personalizada** é criada para cada usuário. Essa sessão é gerenciada pelo **AsyncStorage**, permitindo a navegação pelo sistema sem a necessidade de relogar. Ao final da sessão, os dados do usuário são removidos da memória, proporcionando mais segurança e evitando que informações sensíveis permaneçam acessíveis após o uso.

### 3. **Persistência de Dados com AsyncStorage**
O SnapStock garante a **persistência de dados** de forma local com **AsyncStorage**, mantendo as informações dos usuários, como produtos e preferências, mesmo após o aplicativo ser fechado. Ao abrir o aplicativo novamente, os dados são carregados automaticamente, oferecendo uma experiência fluida e contínua.

### 4. **Gerenciamento de Produtos**
O SnapStock permite que os usuários gerenciem o estoque de produtos, oferecendo funcionalidades como:
- Cadastro de novos produtos
- Edição de produtos existentes
- Exclusão de produtos
- Informações de cada produto, como:
  - Nome
  - Quantidade disponível
  - Descrição
  - Link de referência (opcional)
  - Imagem do produto

Esses itens são exibidos em uma **FlatList**, otimizando a performance do aplicativo ao lidar com grandes listas de produtos.

### 5. **Captura de Imagens**
Com a integração do módulo **ImagePicker** do **Expo**, o SnapStock permite que os usuários capturem imagens de produtos diretamente da câmera do dispositivo ou escolham imagens da galeria. As imagens podem ser usadas para registrar visualmente os produtos e são armazenadas de forma persistente.

## Tecnologias Utilizadas
- **React Native**: Framework principal para desenvolvimento do aplicativo.
- **AsyncStorage**: Persistência de dados local.
- **CryptoJS**: Criptografia de senhas.
- **Expo ImagePicker**: Captura e seleção de imagens.
- **React Navigation**: Navegação entre telas.


### **Como Contribuir**

Sinta-se à vontade para contribuir com o projeto. As principais áreas de contribuição incluem:

- Implementação de novos recursos.
- Correção de bugs.
- Melhoria dos testes automatizados.
- Otimização de desempenho.

### **Contato**

Para dúvidas ou mais informações, entre em [Contato](https://linktr.ee/leomolinarodev01).
