/* ============================================================
   CONFIGURAÇÃO DA CAMPANHA — edite só este arquivo
   Datas e horários sempre no horário de Brasília (-03:00).
   ============================================================ */
window.CAMPANHA = {
  // Início do aulão (o 3º lote fecha neste horário)
  aula: "2026-11-25T09:00:00-03:00",

  lotes: [
    { nome: "1º lote", preco: "R$ 47", parcela: "ou 12x de R$ 4,90*", periodo: "até 11/11",
      fim: "2026-11-11T23:59:59-03:00",
      checkout: "#CHECKOUT-LOTE-1" },
    { nome: "2º lote", preco: "R$ 57", parcela: "ou 12x de R$ 5,94*", periodo: "de 12/11 a 18/11",
      inicio: "2026-11-12T00:00:00-03:00", fim: "2026-11-18T23:59:59-03:00",
      checkout: "#CHECKOUT-LOTE-2" },
    { nome: "3º lote (último)", preco: "R$ 67", parcela: "ou 12x de R$ 6,98*", periodo: "de 19/11 até a aula",
      inicio: "2026-11-19T00:00:00-03:00",
      checkout: "#CHECKOUT-LOTE-3" }
  ],

  // Página de obrigado
  grupoWhatsApp: "#LINK-DO-GRUPO-DE-AVISOS"
};
