    participant user as User
    participant browser as Browser
    participant server as Server

    user->>browser: Ingresa una nota en el campo de texto
    user->>browser: Click en el boton save

    Note right of browser: El navegador captura el evento de envío de formulario y se envía la new note al servidor 

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note (AJAX)
    activate server
    server-->>browser: Response status 201 new note creada exitosamente
    deactivate server

    Note right of browser: El navegador actualiza la lista de notas conla nueva entrada new note sin refrescar la pagina(pues porque usa AJAX)
