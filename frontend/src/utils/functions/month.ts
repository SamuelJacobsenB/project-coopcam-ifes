export function monthToString(month: number) {
  switch (month) {
    case 1:
      return "Janeiro";
    case 2:
      return "Fevereiro";
    case 3:
      return "Março";
    case 4:
      return "Abril";
    case 5:
      return "Maio";
    case 6:
      return "Junho";
    case 7:
      return "Julho";
    case 8:
      return "Agosto";
    case 9:
      return "Setembro";
    case 10:
      return "Outubro";
    case 11:
      return "Novembro";
    default:
      return "Dezembro";
  }
}

export function monthToNumber(month: string) {
  switch (month) {
    case "Janeiro":
      return 1;
    case "Fevereiro":
      return 2;
    case "Março":
      return 3;
    case "Abril":
      return 4;
    case "Maio":
      return 5;
    case "Junho":
      return 6;
    case "Julho":
      return 7;
    case "Agosto":
      return 8;
    case "Setembro":
      return 9;
    case "Outubro":
      return 10;
    case "Novembro":
      return 11;
    default:
      return 12;
  }
}
