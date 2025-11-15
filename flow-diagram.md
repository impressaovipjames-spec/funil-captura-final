# Diagrama de Fluxo do Funil de Captura

## Fluxo Completo do Funil

```mermaid
flowchart TD
    Start([Usuário Acessa /]) --> CapturaPage[Página de Captura]
    CapturaPage --> Form[Formulário: Nome + Email]
    Form --> UserFill[Usuário Preenche Dados]
    UserFill --> Submit[Clica em Cadastrar]
    
    Submit --> FrontValidation{Validação Frontend<br/>React Hook Form + Zod}
    FrontValidation -->|Erro| ShowError[Exibir Erro no Formulário]
    ShowError --> Form
    
    FrontValidation -->|Sucesso| SendAPI[POST /api/leads]
    
    SendAPI --> Middleware{Middleware de Validação}
    Middleware -->|Body inválido| Error400A[400: Requisição inválida]
    Middleware -->|Campos faltando| Error400B[400: Campos obrigatórios]
    Middleware -->|Tipo incorreto| Error400C[400: Dados inválidos]
    
    Middleware -->|Sucesso| Sanitize[Sanitização de Entrada<br/>Remove caracteres perigosos]
    
    Sanitize --> EmailValidation{Validação Email<br/>Regex Pattern}
    EmailValidation -->|Inválido| Error400D[400: Email inválido]
    
    EmailValidation -->|Válido| ZodValidation{Validação Zod Schema}
    ZodValidation -->|Erro| Error400E[400: Dados inválidos]
    
    ZodValidation -->|Sucesso| CreateLead[Criar Lead Object<br/>ID = UUID v4]
    
    CreateLead --> SaveMemory[Salvar em Memória<br/>Map<string, Lead>]
    
    SaveMemory --> CheckBackup{leads.json existe?}
    CheckBackup -->|Sim| CreateBackup[Copiar para leads.bak.json]
    CheckBackup -->|Não| SaveFile
    CreateBackup --> SaveFile[Salvar em leads.json]
    
    SaveFile --> SaveLocalStorage[Salvar Nome em localStorage]
    
    SaveLocalStorage --> Response200[200: Success Response<br/>success, message, data]
    
    Response200 --> Redirect[Redirecionar para /confirmacao]
    
    Error400A --> ErrorResponse[Error Response<br/>success: false, message, data: null]
    Error400B --> ErrorResponse
    Error400C --> ErrorResponse
    Error400D --> ErrorResponse
    Error400E --> ErrorResponse
    ErrorResponse --> ShowError
    
    Redirect --> ConfirmacaoPage[Página de Confirmação]
    ConfirmacaoPage --> LoadName[Carregar Nome do localStorage]
    LoadName --> ShowMessage[Exibir: Cadastro Confirmado, Nome!]
    ShowMessage --> LinkEntrega[Link: Acessar Conteúdo]
    
    LinkEntrega --> ClickLink[Usuário Clica no Link]
    ClickLink --> EntregaPage[Página de Entrega]
    EntregaPage --> LoadName2[Carregar Nome do localStorage]
    LoadName2 --> ShowWelcome[Exibir: Olá, Nome]
    ShowWelcome --> Content[Exibir Conteúdo Placeholder]
    Content --> End([Fim do Funil])
```

## Fluxo de Dados - Armazenamento

```mermaid
flowchart LR
    API[API POST /api/leads] --> Memory[(Memória<br/>Map)]
    Memory --> JSON[leads.json]
    JSON --> Backup[leads.bak.json]
    
    Memory --> Export[Script Export]
    Export --> CSV[leads.csv]
    
    Seeds[seeds.json] --> SeedScript[Script Seed]
    SeedScript --> JSON
    
    Reset[Script Reset] --> Delete1[Deletar leads.json]
    Reset --> Delete2[Deletar leads.bak.json]
```

## Validação em Camadas

```mermaid
flowchart TD
    Input[Dados de Entrada] --> Layer1[Camada 1: Middleware]
    Layer1 --> Check1{Body existe?<br/>Campos presentes?<br/>Tipos corretos?}
    Check1 -->|Não| Reject1[Rejeitar: 400]
    Check1 -->|Sim| Layer2[Camada 2: Sanitização]
    
    Layer2 --> Clean[Remove: < e ><br/>Trim espaços]
    Clean --> Layer3[Camada 3: Email Regex]
    
    Layer3 --> Check2{Email válido?<br/>/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
    Check2 -->|Não| Reject2[Rejeitar: 400 Email inválido]
    Check2 -->|Sim| Layer4[Camada 4: Zod Schema]
    
    Layer4 --> Check3{Schema válido?}
    Check3 -->|Não| Reject3[Rejeitar: 400 Dados inválidos]
    Check3 -->|Sim| Accept[Aceitar e Processar]
```

## Rotas da API

```mermaid
flowchart TD
    Client[Cliente/Browser] --> Routes{Rotas}
    
    Routes -->|GET /healthcheck| Health[Healthcheck Handler]
    Health --> HealthResp[Response: status: ok]
    
    Routes -->|POST /api/leads| Create[Create Lead Handler]
    Create --> Validate[Validar + Sanitizar]
    Validate --> Store[Salvar Storage]
    Store --> CreateResp[Response: success, message, data]
    
    Routes -->|GET /api/leads| List[List Leads Handler]
    List --> GetAll[storage.getAllLeads]
    GetAll --> ListResp[Response: success, message, data: array]
    
    Routes -->|GET /leads| Debug[Debug Handler]
    Debug --> ReadFile[Ler leads.json]
    ReadFile --> DebugResp[Response: success, message, data: total + leads]
    
    Routes --> ErrorHandler[Error Handler Middleware]
    ErrorHandler --> ErrorResp[Response: success: false, message, data: null]
```

## Fluxo de Testes Manuais

```mermaid
flowchart TD
    Start([Iniciar Testes]) --> Test1[Test 1: GET /healthcheck]
    Test1 --> Assert1{Status 200?}
    Assert1 -->|Sim| Pass1[✓ Passou]
    Assert1 -->|Não| Fail1[✗ Falhou]
    
    Pass1 --> Test2[Test 2: POST /api/leads sucesso]
    Fail1 --> Test2
    
    Test2 --> Assert2{Lead criado?}
    Assert2 -->|Sim| Pass2[✓ Passou]
    Assert2 -->|Não| Fail2[✗ Falhou]
    
    Pass2 --> Test3[Test 3: Email inválido]
    Fail2 --> Test3
    
    Test3 --> Assert3{Erro 400?}
    Assert3 -->|Sim| Pass3[✓ Passou]
    Assert3 -->|Não| Fail3[✗ Falhou]
    
    Pass3 --> Test4[Test 4: Campos faltando]
    Fail3 --> Test4
    
    Test4 --> Test5[Test 5: Sanitização]
    Test5 --> Test6[Test 6: GET /api/leads]
    Test6 --> Test7[Test 7: Backup criado]
    Test7 --> Test8[Test 8: Regex validação]
    Test8 --> Test9[Test 9: Respostas padronizadas]
    
    Test9 --> Results[Mostrar Resultados<br/>X passaram, Y falharam]
    Results --> End([Fim dos Testes])
```

## Ciclo de Vida do Lead

```mermaid
stateDiagram-v2
    [*] --> Formulário: Usuário acessa /
    Formulário --> Validando: Usuário envia dados
    Validando --> Erro: Validação falha
    Erro --> Formulário: Corrigir dados
    Validando --> Criado: Validação sucesso
    Criado --> EmMemória: Lead salvo
    EmMemória --> EmArquivo: Persistido em leads.json
    EmArquivo --> ComBackup: Backup criado
    ComBackup --> Confirmado: Usuário redirecionado
    Confirmado --> Entregue: Acessa conteúdo
    Entregue --> [*]: Fim do funil
```

## Estrutura de Resposta Padronizada

```mermaid
classDiagram
    class SuccessResponse {
        +boolean success = true
        +string message
        +object data
    }
    
    class ErrorResponse {
        +boolean success = false
        +string message
        +null data
    }
    
    class Lead {
        +string id (UUID v4)
        +string nome (sanitizado)
        +string email (sanitizado, validado)
    }
    
    SuccessResponse --> Lead: data
```

## Backup e Recuperação

```mermaid
sequenceDiagram
    participant API as API Handler
    participant Storage as MemStorage
    participant File as leads.json
    participant Backup as leads.bak.json
    
    API->>Storage: createLead(data)
    Storage->>Storage: Gerar UUID
    Storage->>Storage: Adicionar ao Map
    Storage->>File: Verificar existência
    
    alt Arquivo existe
        File->>Backup: Copiar conteúdo
        Backup-->>Storage: Backup criado
    end
    
    Storage->>File: Escrever JSON
    File-->>Storage: Salvo com sucesso
    Storage-->>API: Retornar Lead criado
```
