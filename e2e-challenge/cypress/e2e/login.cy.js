describe("Prueba E2E Completa - Login, Panel > Households y agregar Household", () => {
    it("Debe permitir login, navegar a Households y agregar un nuevo household", () => {
      // 1. Entrar al login
      cy.visit("https://login.hyphalab.dev");
      cy.screenshot("01-pagina-login");
  
      // 2. Ingresar usuario y contraseña
      cy.get('input[name="username"]').type("hyphatest");
      cy.get('input[name="password"]').type("Hypha2025.");
      cy.get('button[type="submit"]').click();
      cy.screenshot("02-despues-de-login");
  
      // 3. Validar dentro del dashboard (otro dominio)
      cy.origin("https://pas.hyphalab.dev", () => {
        cy.url().should("include", "/dashboards/kpis-v2");
        cy.screenshot("03-dashboard-url-ok");
  
        // Abrir Panel y entrar a Households
        cy.contains("Panel").click({ force: true });
        cy.screenshot("04-menu-panel");
        cy.contains("Households").click();
        cy.screenshot("05-panel-households");
  
        // Validar que la tabla cargó
        cy.get("table, [role='table']").should("be.visible");
        cy.screenshot("06-households-tabla");
  
        // Abrir Actions y Add Households
        cy.contains("Actions").click();
        cy.screenshot("07-actions-desplegable");
        cy.contains("Add Households").click();
        cy.screenshot("08-add-households");
  
        // Seleccionar campo Time Zone
        cy.get(".react-select__control").eq(0).click(); 
        cy.get(".react-select__option").first().click(); 
        cy.screenshot("09-timezone");
  
        //Sekect campo Best Time to Contact
        cy.get(".react-select__control").eq(0).click();
        cy.get(".react-select__option").first().click(); 
        cy.screenshot("10-besttime");
  
        // Presiono botón save
        cy.contains("Save").click();
        cy.screenshot("11-save-household");
  
        // Confirmacion de creacion en modal
        cy.contains("Yes").click();
        cy.screenshot("12-confirmacion-modal");
  
        // Confirmar creación exitosa
        cy.contains("The household was created successfully", { timeout: 10000 })
          .should("be.visible");
        cy.screenshot("13-confirmacion-exito");
      });
    });
  });