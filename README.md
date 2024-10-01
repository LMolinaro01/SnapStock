# **SnapStock: Aplicação Mobile de Controle de Estoque com React Native**

(Projeto em Andamento)

### **Planejamento**

![image](https://github.com/user-attachments/assets/70150c54-bd36-4bde-bf14-c221481551c5)

**SnapStock** é uma aplicação Android desenvolvida com **React Native**, projetada para otimizar o controle de estoque de forma intuitiva e eficiente. Este aplicativo permite aos usuários gerenciar seu inventário adicionando itens através de fotos capturadas diretamente no aplicativo, registrando detalhes como nome, quantidade, descrição, link para compra e localização dos itens.

### **Funcionalidades**

- **Adição de Itens**: Capture fotos e registre informações como nome, quantidade, descrição, links de compra e localização.
- **Gerenciamento de Quantidade**: Aumente ou diminua a quantidade de itens diretamente da interface. Caso a quantidade chegue a zero, o aplicativo solicita a confirmação para excluir o item do estoque.
- **Links de Compra**: Adicione links de compra para facilitar o reabastecimento do estoque.
- **Notificações de Estoque Baixo**: Receba notificações no celular quando o estoque de um item atingir níveis baixos.
- **Armazenamento Persistente**: Todos os itens e informações são armazenados de forma segura utilizando o **AsyncStorage** para garantir persistência de dados entre sessões.
- **Pesquisa e Filtros**: Encontre itens rapidamente com funcionalidades de pesquisa avançada e categorização automática.
- **Tirar Fotos de Produtos**: Capture fotos diretamente no aplicativo usando a câmera do dispositivo, facilitando a identificação visual dos itens.

### **Tecnologias Utilizadas**

- **React Native**: Framework para desenvolvimento mobile multiplataforma.
- **JavaScript**: Linguagem de programação base do projeto.
- **AsyncStorage**: Para armazenamento persistente local dos dados.
- **React Navigation**: Navegação entre telas utilizando **StackNavigator** e **DrawerNavigator**.
- **Bibliotecas de terceiros**: Uso de bibliotecas como **react-native-image-picker** para captura de imagens.

### **Testes Automatizados**

Serão implementados **testes automatizados** para garantir a qualidade e funcionalidade da aplicação, utilizando ferramentas como **Jest** e **React Native Testing Library**. Os testes cobrirão funcionalidades críticas, como:

- Adição, remoção e edição de itens.
- Persistência de dados usando AsyncStorage.
- Funcionamento das notificações de estoque baixo.
- Testes de interface para navegação e modais.

### **Como Contribuir**

Sinta-se à vontade para contribuir com o projeto. As principais áreas de contribuição incluem:

- Implementação de novos recursos.
- Correção de bugs.
- Melhoria dos testes automatizados.
- Otimização de desempenho.

### **Contato**

Para dúvidas ou mais informações, entre em [Contato](https://linktr.ee/leomolinarodev01).
