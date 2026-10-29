/** OKLCH ramps. Hue is sampled from each illustration's vivid accent, then snapped to the brief's lightness/chroma bands. Step 9 is fill-only; step 11 is text. */
export interface RootColor {
  hue: number;
  accent: string;
  deep: string;
  wash: string;
  skyTop: string;
  skyBottom: string;
  spark: string;
  steps: readonly string[];
}

export const rootColors: Record<string, RootColor> = {
  port: { hue: 49.0, accent: '#D38A62', deep: '#7B4628', wash: '#FFEBE1', skyTop: '#FFE1D1', skyBottom: '#FCF6EC', spark: '#8EC7E2', steps: ['#FDF9F7', '#FBF4F0', '#FFEBE1', '#FEE5D9', '#FCDCCB', '#F9D1BC', '#EFB89B', '#DF9E7B', '#D38A62', '#B67450', '#7B4628', '#522D19'] },
  spect: { hue: 160.2, accent: '#5DB288', deep: '#206445', wash: '#E2F5EA', skyTop: '#D2F1DF', skyBottom: '#ECFAF9', spark: '#DDADCC', steps: ['#F8FBF9', '#F0F8F3', '#E2F5EA', '#D9F2E4', '#CCECDA', '#BCE6CE', '#9BD5B5', '#79C29B', '#5DB288', '#4A9972', '#206445', '#14422D'] },
  dict: { hue: 20.7, accent: '#D88382', deep: '#7E4141', wash: '#FFEAE9', skyTop: '#FFDFDE', skyBottom: '#FFF4EF', spark: '#86CCD0', steps: ['#FEF9F9', '#FCF3F2', '#FFEAE9', '#FFE3E2', '#FED9D7', '#FDCDCB', '#F3B3B1', '#E49896', '#D88382', '#BA6E6D', '#7E4141', '#542A2A'] },
  scrib: { hue: 256.3, accent: '#72A0DF', deep: '#355684', wash: '#E6F1FF', skyTop: '#DAE9FF', skyBottom: '#F6F6FF', spark: '#D8B88B', steps: ['#F8FBFE', '#F1F6FC', '#E6F1FF', '#DEECFF', '#D2E5FF', '#C4DDFF', '#A6C8F7', '#89B2E9', '#72A0DF', '#5F88C1', '#355684', '#223958'] },
  duc: { hue: 187.9, accent: '#3BB3AA', deep: '#00635E', wash: '#DEF6F3', skyTop: '#CBF1ED', skyBottom: '#ECFAFE', spark: '#E6ACB5', steps: ['#F7FCFB', '#EEF8F7', '#DEF6F3', '#D4F2EF', '#C5EDE8', '#B2E7E1', '#8BD6CF', '#62C2BA', '#3BB3AA', '#289991', '#00635E', '#00423E'] },
  mit: { hue: 7.4, accent: '#D68292', deep: '#7D404D', wash: '#FFEAED', skyTop: '#FFDEE3', skyBottom: '#FFF4F1', spark: '#88CDC5', steps: ['#FEF9FA', '#FCF3F4', '#FFEAED', '#FFE3E7', '#FDD8DE', '#FBCCD4', '#F1B2BD', '#E297A5', '#D68292', '#B96D7C', '#7D404D', '#532932'] },
  ject: { hue: 94.0, accent: '#C7B05F', deep: '#665406', wash: '#F5F0DD', skyTop: '#F0E8CA', skyBottom: '#F4F9EE', spark: '#AFBBEC', steps: ['#FBFAF7', '#F7F5EE', '#F5F0DD', '#F2EBD3', '#ECE3C4', '#E6DBB3', '#D5C68E', '#C2AF69', '#C7B05F', '#9A853A', '#665406', '#433709'] },
  struct: { hue: 79.0, accent: '#D5A960', deep: '#704F08', wash: '#F9EEDE', skyTop: '#F7E5CB', skyBottom: '#F7F8EC', spark: '#A3BFEB', steps: ['#FCFAF7', '#F9F5EE', '#F9EEDE', '#F7E9D4', '#F3E1C5', '#EED7B3', '#E0C18E', '#CFA96A', '#D5A960', '#A67F3B', '#704F08', '#4A340B'] },
  tract: { hue: 128.9, accent: '#8AAB63', deep: '#475F28', wash: '#EBF3E2', skyTop: '#E0EED2', skyBottom: '#EFFAF3', spark: '#CBB2E1', steps: ['#F9FBF8', '#F3F7F0', '#EBF3E2', '#E4EFD9', '#DBE9CC', '#CFE2BC', '#B7D09C', '#9DBB7C', '#8AAB63', '#749250', '#475F28', '#2E3E19'] },
  vert: { hue: 104.0, accent: '#BCB562', deep: '#5E570C', wash: '#F2F1DE', skyTop: '#ECEACB', skyBottom: '#F3F9EF', spark: '#B8B8EA', steps: ['#FBFBF7', '#F6F6EE', '#F2F1DE', '#EEECD4', '#E7E5C5', '#E0DDB4', '#CDC990', '#B9B26C', '#BCB562', '#90893D', '#5E570C', '#3E3A0C'] },
  rupt: { hue: 44.0, accent: '#D58867', deep: '#7C452C', wash: '#FFEBE3', skyTop: '#FFE1D4', skyBottom: '#FDF6EC', spark: '#8CC8DF', steps: ['#FEF9F8', '#FCF3F0', '#FFEBE3', '#FFE5DA', '#FDDBCD', '#FAD0BE', '#F0B79E', '#E19C7F', '#D58867', '#B87254', '#7C452C', '#532D1C'] },
  cred: { hue: 74.0, accent: '#D9A762', deep: '#734D0C', wash: '#FAEEDE', skyTop: '#F8E5CB', skyBottom: '#F8F7EC', spark: '#9FC1EB', steps: ['#FCFAF7', '#FAF5EE', '#FAEEDE', '#F8E8D4', '#F5E0C5', '#F0D6B4', '#E3BF8F', '#D2A76C', '#D9A762', '#AA7D3D', '#734D0C', '#4B330C'] },
  aud: { hue: 287.6, accent: '#9A94DC', deep: '#534D82', wash: '#EEEEFF', skyTop: '#E6E5FF', skyBottom: '#FBF4FE', spark: '#C2C28D', steps: ['#FAFAFE', '#F5F5FC', '#EEEEFF', '#E9E8FF', '#E1E0FF', '#D8D6FD', '#C2BFF5', '#ABA6E7', '#9A94DC', '#837DBE', '#534D82', '#373257'] },
  vid: { hue: 84.0, accent: '#D1AB5F', deep: '#6D5006', wash: '#F8EFDD', skyTop: '#F5E6CA', skyBottom: '#F6F8ED', spark: '#A7BEEC', steps: ['#FCFAF7', '#F9F5EE', '#F8EFDD', '#F5EAD3', '#F1E2C4', '#EBD8B2', '#DDC28E', '#CBAB69', '#D1AB5F', '#A2813A', '#6D5006', '#48350A'] },
  pend: { hue: 182.9, accent: '#40B3A4', deep: '#00645A', wash: '#DEF6F1', skyTop: '#CCF1EA', skyBottom: '#ECFAFD', spark: '#E5ABB9', steps: ['#F7FCFB', '#EFF8F6', '#DEF6F1', '#D5F2ED', '#C6EDE6', '#B4E7DE', '#8DD6CA', '#65C2B4', '#40B3A4', '#2D9A8C', '#00645A', '#00423B'] },
  cap: { hue: 35.7, accent: '#D78670', deep: '#7D4333', wash: '#FFEBE5', skyTop: '#FFE0D8', skyBottom: '#FEF5EC', spark: '#89CADA', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE5', '#FFE4DD', '#FEDAD0', '#FCCFC2', '#F2B5A5', '#E39A87', '#D78670', '#B9705D', '#7D4333', '#542B21'] },
  form: { hue: 207.3, accent: '#38B0BF', deep: '#00616B', wash: '#DEF5F8', skyTop: '#CAF0F6', skyBottom: '#EFF8FF', spark: '#E8ADA5', steps: ['#F7FBFC', '#EEF7F9', '#DEF5F8', '#D3F1F6', '#C4ECF2', '#B1E5ED', '#8AD4DF', '#60C0CD', '#38B0BF', '#2497A5', '#00616B', '#004048'] },
  sent: { hue: 12.4, accent: '#D7828C', deep: '#7D4048', wash: '#FFEAEB', skyTop: '#FFDFE1', skyBottom: '#FFF4F0', spark: '#87CDCA', steps: ['#FEF9F9', '#FCF3F3', '#FFEAEB', '#FFE3E5', '#FED8DC', '#FCCDD1', '#F2B2B8', '#E3979F', '#D7828C', '#B96D76', '#7D4048', '#54292F'] },
  voc: { hue: 353.9, accent: '#D182A3', deep: '#7A4059', wash: '#FEE9F1', skyTop: '#FFDDEA', skyBottom: '#FFF4F3', spark: '#8ECDBA', steps: ['#FDF9FB', '#FBF3F6', '#FEE9F1', '#FDE3EC', '#FBD8E5', '#F9CCDD', '#EEB2C9', '#DE97B3', '#D182A3', '#B46D8B', '#7A4059', '#512A3A'] },
  manu: { hue: 30.7, accent: '#D78576', deep: '#7E4238', wash: '#FFEBE7', skyTop: '#FFE0DA', skyBottom: '#FFF5ED', spark: '#87CAD7', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE7', '#FFE4DF', '#FEDAD3', '#FCCEC5', '#F3B4A9', '#E4998C', '#D78576', '#BA6F62', '#7E4238', '#542B24'] },
  ped: { hue: 64.0, accent: '#CC9055', deep: '#764A1C', wash: '#FCEDDF', skyTop: '#FCE3CD', skyBottom: '#FAF7EC', spark: '#97C3E8', steps: ['#FDFAF7', '#FAF4EF', '#FCEDDF', '#FBE7D5', '#F8DEC7', '#F5D4B6', '#E9BC93', '#D9A370', '#CC9055', '#B07943', '#764A1C', '#4F3011'] },
  spir: { hue: 240.7, accent: '#5DA6D9', deep: '#215B80', wash: '#E2F2FF', skyTop: '#D3ECFF', skyBottom: '#F4F7FF', spark: '#E0B490', steps: ['#F8FBFE', '#F0F6FC', '#E2F2FF', '#D9EEFF', '#CBE8FD', '#BBE0FB', '#9ACDF2', '#78B7E4', '#5DA6D9', '#4A8EBC', '#215B80', '#143C56'] },
  luc: { hue: 69.0, accent: '#C99251', deep: '#744C18', wash: '#FBEDDE', skyTop: '#FAE4CC', skyBottom: '#F9F7EC', spark: '#9BC2EA', steps: ['#FDFAF7', '#FAF4EE', '#FBEDDE', '#FAE8D5', '#F6DFC6', '#F3D5B5', '#E6BD91', '#D6A56E', '#C99251', '#AD7B40', '#744C18', '#4D310E'] },
  cord: { hue: 25.7, accent: '#D8847C', deep: '#7E413C', wash: '#FFEAE8', skyTop: '#FFDFDC', skyBottom: '#FFF5EE', spark: '#87CBD4', steps: ['#FEF9F9', '#FCF3F2', '#FFEAE8', '#FFE4E0', '#FED9D5', '#FCCDC8', '#F3B3AD', '#E49891', '#D8847C', '#BA6E67', '#7E413C', '#542A27'] },
  mov: { hue: 316.3, accent: '#B88ACA', deep: '#684675', wash: '#F7EBFB', skyTop: '#F3E0FA', skyBottom: '#FFF3F9', spark: '#AAC99C', steps: ['#FCF9FD', '#F8F3FA', '#F7EBFB', '#F4E5FA', '#EFDBF7', '#E9D0F3', '#D9B7E7', '#C69DD7', '#B88ACA', '#9E74AE', '#684675', '#452D4E'] },
  flu: { hue: 219.5, accent: '#42ADCB', deep: '#006075', wash: '#DEF4FB', skyTop: '#CBEFFA', skyBottom: '#F1F8FF', spark: '#E6AF9C', steps: ['#F7FBFD', '#EEF7FA', '#DEF4FB', '#D4F0FA', '#C5EBF7', '#B3E4F3', '#8DD2E7', '#66BDD7', '#42ADCB', '#2F94AF', '#006075', '#003F4E'] },
  bene: { hue: 54.0, accent: '#D18C5D', deep: '#7A4724', wash: '#FEECE1', skyTop: '#FEE1CF', skyBottom: '#FCF6EC', spark: '#91C6E4', steps: ['#FDFAF7', '#FBF4EF', '#FEECE1', '#FDE6D7', '#FBDCCA', '#F8D2BA', '#EDB998', '#DD9F77', '#D18C5D', '#B4754B', '#7A4724', '#512E16'] },
  mal: { hue: 140.1, accent: '#7AAE6F', deep: '#3A6132', wash: '#E7F4E4', skyTop: '#DAEFD6', skyBottom: '#EEFAF5', spark: '#D2B0DA', steps: ['#F9FBF8', '#F2F7F1', '#E7F4E4', '#E0F1DC', '#D5EBD0', '#C8E4C2', '#ACD2A4', '#90BE86', '#7AAE6F', '#66955C', '#3A6132', '#264020'] },
  graph: { hue: 261.3, accent: '#799EE0', deep: '#3A5585', wash: '#E8F0FF', skyTop: '#DCE9FF', skyBottom: '#F7F5FF', spark: '#D5BA8A', steps: ['#F8FAFE', '#F2F6FC', '#E8F0FF', '#E0ECFF', '#D5E4FF', '#C7DBFF', '#ABC7F7', '#8FB0EA', '#799EE0', '#6586C2', '#3A5585', '#253859'] },
  phon: { hue: 245.7, accent: '#64A4DB', deep: '#285A82', wash: '#E4F2FF', skyTop: '#D5EBFF', skyBottom: '#F4F6FF', spark: '#DDB58E', steps: ['#F8FBFE', '#F0F6FC', '#E4F2FF', '#DAEEFF', '#CDE7FE', '#BEDFFD', '#9ECBF4', '#7DB5E6', '#64A4DB', '#518CBE', '#285A82', '#193B57'] },
  log: { hue: 345.5, accent: '#CD83AC', deep: '#774160', wash: '#FDE9F3', skyTop: '#FDDEEE', skyBottom: '#FFF4F4', spark: '#93CDB3', steps: ['#FDF9FB', '#FBF3F7', '#FDE9F3', '#FCE3F0', '#F9D9E9', '#F6CDE2', '#EAB3D0', '#DA98BC', '#CD83AC', '#B16E93', '#774160', '#4F2A3F'] },
  bio: { hue: 135.1, accent: '#81AD69', deep: '#40602E', wash: '#E9F4E3', skyTop: '#DDEED4', skyBottom: '#EEFAF4', spark: '#CFB1DD', steps: ['#F9FBF8', '#F3F7F0', '#E9F4E3', '#E2F0DB', '#D8EACE', '#CBE3BF', '#B1D1A0', '#96BD81', '#81AD69', '#6C9456', '#40602E', '#293F1D'] },
  geo: { hue: 230.7, accent: '#4FAAD3', deep: '#105D7C', wash: '#E0F3FE', skyTop: '#CEEEFE', skyBottom: '#F2F7FF', spark: '#E3B195', steps: ['#F7FBFD', '#EFF7FB', '#E0F3FE', '#D6EFFD', '#C8E9FA', '#B7E2F8', '#93CFEE', '#6EBADF', '#4FAAD3', '#3D91B6', '#105D7C', '#093E53'] },
  hydr: { hue: 212.5, accent: '#3BAFC4', deep: '#00616F', wash: '#DEF5FA', skyTop: '#CBF0F8', skyBottom: '#F0F8FF', spark: '#E7AEA1', steps: ['#F7FBFC', '#EEF7F9', '#DEF5FA', '#D4F1F8', '#C4EBF4', '#B2E5F0', '#8BD3E2', '#62BFD2', '#3BAFC4', '#2896A9', '#00616F', '#00404A'] },
  phot: { hue: 99.0, accent: '#C2B260', deep: '#625608', wash: '#F4F0DE', skyTop: '#EEE9CB', skyBottom: '#F4F9EE', spark: '#B3BAEB', steps: ['#FBFAF7', '#F7F6EE', '#F4F0DE', '#F0ECD4', '#EAE4C5', '#E3DCB3', '#D1C78F', '#BEB06A', '#C2B260', '#95873B', '#625608', '#40380A'] },
  chron: { hue: 266.3, accent: '#809CE0', deep: '#3F5385', wash: '#E9F0FF', skyTop: '#DEE8FF', skyBottom: '#F7F5FF', spark: '#D2BB8A', steps: ['#F9FAFE', '#F2F5FC', '#E9F0FF', '#E2EBFF', '#D7E3FF', '#CADAFF', '#AFC5F7', '#94AEEA', '#809CE0', '#6B85C2', '#3F5385', '#293759'] },
  psych: { hue: 304.4, accent: '#AD8DD3', deep: '#60497C', wash: '#F3ECFE', skyTop: '#EEE2FE', skyBottom: '#FEF3FB', spark: '#B4C695', steps: ['#FBFAFD', '#F7F4FB', '#F3ECFE', '#EFE6FD', '#E9DDFB', '#E2D2F8', '#D0BAEE', '#BCA1DF', '#AD8DD3', '#9477B6', '#60497C', '#402F52'] },
  path: { hue: 89.0, accent: '#CCAE5E', deep: '#6A5205', wash: '#F6EFDD', skyTop: '#F3E7CA', skyBottom: '#F5F8ED', spark: '#ABBDEC', steps: ['#FCFAF7', '#F8F5EE', '#F6EFDD', '#F3EAD3', '#EEE2C4', '#E9D9B2', '#D9C48E', '#C7AD69', '#CCAE5E', '#9E833A', '#6A5205', '#453609'] },
  phil: { hue: 59.0, accent: '#CF8E59', deep: '#78491F', wash: '#FDECE0', skyTop: '#FDE2CE', skyBottom: '#FBF7EC', spark: '#94C5E6', steps: ['#FDFAF7', '#FBF4EF', '#FDECE0', '#FCE6D6', '#F9DDC8', '#F6D3B8', '#EBBB95', '#DBA173', '#CF8E59', '#B27747', '#78491F', '#502F13'] },
  morph: { hue: 235.7, accent: '#56A8D6', deep: '#195C7E', wash: '#E1F3FF', skyTop: '#D0EDFF', skyBottom: '#F3F7FF', spark: '#E2B393', steps: ['#F7FBFD', '#EFF7FB', '#E1F3FF', '#D7EFFE', '#CAE8FC', '#B9E1FA', '#96CEF0', '#73B9E2', '#56A8D6', '#448FB9', '#195C7E', '#0F3D54'] },
  aster: { hue: 271.3, accent: '#869AE0', deep: '#445285', wash: '#EAEFFF', skyTop: '#DFE7FF', skyBottom: '#F8F5FF', spark: '#CEBD8A', steps: ['#F9FAFE', '#F3F5FC', '#EAEFFF', '#E4EAFF', '#D9E2FF', '#CDD9FF', '#B4C4F7', '#9AACEA', '#869AE0', '#7183C2', '#445285', '#2C3659'] },
  meter: { hue: 154.7, accent: '#65B181', deep: '#286340', wash: '#E3F5E8', skyTop: '#D4F0DC', skyBottom: '#ECFAF8', spark: '#DBADD0', steps: ['#F8FBF9', '#F0F8F2', '#E3F5E8', '#DBF2E2', '#CEECD7', '#BFE6CB', '#9FD5B0', '#7FC195', '#65B181', '#52986C', '#286340', '#194229'] },
  pos: { hue: 261.7, accent: '#7A9EE0', deep: '#3B5585', wash: '#E8F0FF', skyTop: '#DCE9FF', skyBottom: '#F7F5FF', spark: '#D5BA8A', steps: ['#F9FAFE', '#F2F6FC', '#E8F0FF', '#E0EBFF', '#D5E4FF', '#C7DBFF', '#ABC7F7', '#8FB0EA', '#7A9EE0', '#6586C2', '#3B5585', '#263859'] },
  fer: { hue: 68.6, accent: '#C99252', deep: '#744C18', wash: '#FBEDDE', skyTop: '#FAE4CC', skyBottom: '#F9F7EC', spark: '#9BC2E9', steps: ['#FDFAF7', '#FAF4EE', '#FBEDDE', '#FAE8D5', '#F6DFC6', '#F3D5B5', '#E6BD91', '#D6A56E', '#C99252', '#AD7B40', '#744C18', '#4D310E'] },
  ten: { hue: 191.0, accent: '#39B3AE', deep: '#006360', wash: '#DEF6F4', skyTop: '#CAF1EE', skyBottom: '#ECF9FE', spark: '#E7ACB3', steps: ['#F7FCFB', '#EEF8F7', '#DEF6F4', '#D4F2F0', '#C4EDEA', '#B2E6E3', '#8BD6D1', '#61C2BD', '#39B3AE', '#259995', '#006360', '#00423F'] },
  fac: { hue: 49.2, accent: '#D38A62', deep: '#7B4628', wash: '#FFEBE1', skyTop: '#FFE1D1', skyBottom: '#FCF6EC', spark: '#8EC7E2', steps: ['#FDF9F7', '#FBF4F0', '#FFEBE1', '#FEE5D8', '#FCDCCB', '#F9D1BC', '#EFB89B', '#DF9E7B', '#D38A62', '#B6744F', '#7B4628', '#522D19'] },
  ven: { hue: 317.6, accent: '#B989C9', deep: '#694674', wash: '#F7EBFB', skyTop: '#F3E0FA', skyBottom: '#FFF3F9', spark: '#A8C99D', steps: ['#FCF9FD', '#F8F3FA', '#F7EBFB', '#F4E5F9', '#EFDBF6', '#EAD0F2', '#DAB7E6', '#C89DD6', '#B989C9', '#9F73AD', '#694674', '#462D4D'] },
  sta: { hue: 229.6, accent: '#4EAAD2', deep: '#0D5E7B', wash: '#E0F3FE', skyTop: '#CEEEFE', skyBottom: '#F2F7FF', spark: '#E4B196', steps: ['#F7FBFD', '#EFF7FB', '#E0F3FE', '#D6F0FC', '#C8E9FA', '#B7E2F8', '#92D0ED', '#6DBADE', '#4EAAD2', '#3C91B6', '#0D5E7B', '#083E52'] },
  ced: { hue: 31.2, accent: '#D78575', deep: '#7E4237', wash: '#FFEBE6', skyTop: '#FFE0D9', skyBottom: '#FFF5ED', spark: '#87CAD7', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE6', '#FFE4DE', '#FEDAD2', '#FCCEC5', '#F2B4A8', '#E3998B', '#D78575', '#BA6F62', '#7E4237', '#542B23'] },
  press: { hue: 129.5, accent: '#89AB63', deep: '#465F29', wash: '#EAF3E2', skyTop: '#DFEED2', skyBottom: '#EFFAF3', spark: '#CBB2E0', steps: ['#F9FBF8', '#F3F7F0', '#EAF3E2', '#E4F0D9', '#DAE9CC', '#CFE2BD', '#B6D09C', '#9DBB7C', '#89AB63', '#739251', '#465F29', '#2E3E19'] },
  curr: { hue: 13.6, accent: '#D7828B', deep: '#7E4047', wash: '#FFEAEB', skyTop: '#FFDFE1', skyBottom: '#FFF4F0', spark: '#87CCCA', steps: ['#FEF9F9', '#FCF3F3', '#FFEAEB', '#FFE3E5', '#FED9DB', '#FCCDD0', '#F2B2B7', '#E3979E', '#D7828B', '#BA6D75', '#7E4047', '#54292E'] },
  gress: { hue: 279.0, accent: '#9097DF', deep: '#4C5084', wash: '#ECEFFF', skyTop: '#E2E6FF', skyBottom: '#FAF4FF', spark: '#C9BF8B', steps: ['#FAFAFE', '#F4F5FC', '#ECEFFF', '#E6E9FF', '#DDE1FF', '#D2D7FF', '#BBC1F6', '#A2A9E9', '#9097DF', '#7A80C1', '#4C5084', '#313458'] },
  ag: { hue: 144.2, accent: '#74AF74', deep: '#366236', wash: '#E6F5E6', skyTop: '#D8EFD8', skyBottom: '#EDFAF6', spark: '#D5AFD7', steps: ['#F8FBF8', '#F2F7F1', '#E6F5E6', '#DFF1DE', '#D3EBD2', '#C6E4C4', '#A9D3A7', '#8BBF8A', '#74AF74', '#609660', '#366236', '#224122'] },
  gen: { hue: 45.7, accent: '#D48965', deep: '#7C452B', wash: '#FFEBE2', skyTop: '#FFE1D3', skyBottom: '#FDF6EC', spark: '#8CC8E0', steps: ['#FEF9F8', '#FCF4F0', '#FFEBE2', '#FEE5D9', '#FCDBCC', '#FAD0BD', '#F0B79D', '#E09D7E', '#D48965', '#B77353', '#7C452B', '#532D1B'] },
  leg: { hue: 142.1, accent: '#77AF72', deep: '#386134', wash: '#E7F4E5', skyTop: '#D9EFD7', skyBottom: '#EDFAF6', spark: '#D4AFD9', steps: ['#F9FBF8', '#F2F7F1', '#E7F4E5', '#DFF1DD', '#D4EBD1', '#C7E4C3', '#AAD3A6', '#8EBE88', '#77AF72', '#63955E', '#386134', '#244021'] },
  reg: { hue: 328.8, accent: '#C286BE', deep: '#6F436D', wash: '#FAEAF8', skyTop: '#F8DFF5', skyBottom: '#FFF3F6', spark: '#9FCBA5', steps: ['#FCF9FC', '#F9F3F9', '#FAEAF8', '#F8E4F6', '#F4DAF1', '#EFCEEC', '#E2B5DE', '#D09ACC', '#C286BE', '#A771A4', '#6F436D', '#4A2C48'] },
  plic: { hue: 267.7, accent: '#829CE0', deep: '#415385', wash: '#E9F0FF', skyTop: '#DEE8FF', skyBottom: '#F8F5FF', spark: '#D1BC8A', steps: ['#F9FAFE', '#F2F5FC', '#E9F0FF', '#E2EBFF', '#D8E3FF', '#CBDAFF', '#B0C5F7', '#96AEEA', '#829CE0', '#6D84C2', '#415385', '#2A3759'] },
  tend: { hue: 35.4, accent: '#D78671', deep: '#7E4334', wash: '#FFEBE5', skyTop: '#FFE0D8', skyBottom: '#FEF5ED', spark: '#88CADA', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE5', '#FFE4DD', '#FEDAD1', '#FCCFC3', '#F2B5A5', '#E39A87', '#D78671', '#B9705D', '#7E4334', '#542B21'] },
  sequ: { hue: 185.1, accent: '#3EB3A7', deep: '#00645B', wash: '#DEF6F2', skyTop: '#CBF1EB', skyBottom: '#ECFAFD', spark: '#E6ABB7', steps: ['#F7FCFB', '#EEF8F6', '#DEF6F2', '#D4F2EE', '#C5EDE7', '#B3E7DF', '#8CD6CC', '#64C2B7', '#3EB3A7', '#2A998E', '#00645B', '#00423C'] },
  clud: { hue: 300.9, accent: '#A98FD5', deep: '#5E4A7D', wash: '#F2ECFE', skyTop: '#ECE2FF', skyBottom: '#FDF3FC', spark: '#B7C593', steps: ['#FBFAFD', '#F6F4FB', '#F2ECFE', '#EEE6FE', '#E8DDFC', '#E0D3F9', '#CEBBEF', '#B9A2E1', '#A98FD5', '#9078B8', '#5E4A7D', '#3E3054'] },
  cid: { hue: 175.7, accent: '#48B39B', deep: '#006453', wash: '#DFF6EF', skyTop: '#CDF1E7', skyBottom: '#ECFAFC', spark: '#E3ACBF', steps: ['#F7FCFA', '#EFF8F5', '#DFF6EF', '#D6F2EA', '#C7EDE2', '#B6E7D9', '#91D6C3', '#6AC3AD', '#48B39B', '#359A84', '#006453', '#024337'] },
  cad: { hue: 100.6, accent: '#C0B361', deep: '#615609', wash: '#F3F1DE', skyTop: '#EDE9CB', skyBottom: '#F3F9EF', spark: '#B5B9EB', steps: ['#FBFBF7', '#F7F6EE', '#F3F1DE', '#EFECD4', '#E9E5C5', '#E2DCB3', '#D0C88F', '#BCB16B', '#C0B361', '#94883C', '#615609', '#40390B'] },
  fin: { hue: 256.0, accent: '#72A0DF', deep: '#345784', wash: '#E6F1FF', skyTop: '#D9E9FF', skyBottom: '#F6F6FF', spark: '#D8B88B', steps: ['#F8FBFE', '#F1F6FC', '#E6F1FF', '#DEECFF', '#D2E5FF', '#C4DDFF', '#A6C8F6', '#89B2E9', '#72A0DF', '#5E88C1', '#345784', '#213958'] },
  flect: { hue: 154.6, accent: '#65B181', deep: '#286340', wash: '#E4F5E8', skyTop: '#D4F0DC', skyBottom: '#ECFAF8', spark: '#DBADD0', steps: ['#F8FBF9', '#F1F8F2', '#E4F5E8', '#DBF2E1', '#CEECD7', '#BFE6CB', '#9FD5B0', '#7FC195', '#65B181', '#52986C', '#286340', '#194229'] },
  junct: { hue: 353.2, accent: '#D182A3', deep: '#794059', wash: '#FEE9F1', skyTop: '#FFDDEA', skyBottom: '#FFF4F3', spark: '#8ECDBA', steps: ['#FDF9FB', '#FBF3F6', '#FEE9F1', '#FDE3ED', '#FBD8E5', '#F8CCDD', '#EDB2CA', '#DE97B4', '#D182A3', '#B46D8B', '#794059', '#512A3B'] },
  loc: { hue: 29.9, accent: '#D78577', deep: '#7E4239', wash: '#FFEBE7', skyTop: '#FFE0DA', skyBottom: '#FFF5ED', spark: '#87CBD7', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE7', '#FFE4DF', '#FEDAD3', '#FCCEC6', '#F3B4A9', '#E4998D', '#D78577', '#BA6F63', '#7E4239', '#542B24'] },
  loqu: { hue: 24.7, accent: '#D8847D', deep: '#7E413D', wash: '#FFEAE8', skyTop: '#FFDFDC', skyBottom: '#FFF4EE', spark: '#86CBD3', steps: ['#FEF9F9', '#FCF3F2', '#FFEAE8', '#FFE4E1', '#FED9D5', '#FDCDC9', '#F3B3AE', '#E49892', '#D8847D', '#BA6E69', '#7E413D', '#542A27'] },
  mand: { hue: 36.2, accent: '#D78670', deep: '#7D4333', wash: '#FFEBE5', skyTop: '#FFE0D7', skyBottom: '#FEF5EC', spark: '#89CADB', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE5', '#FFE4DD', '#FEDAD0', '#FCCFC2', '#F2B5A4', '#E39A86', '#D78670', '#B9705C', '#7D4333', '#542B20'] },
  ment: { hue: 147.5, accent: '#70B078', deep: '#326239', wash: '#E5F5E6', skyTop: '#D7F0D9', skyBottom: '#EDFAF7', spark: '#D7AED5', steps: ['#F8FBF8', '#F1F7F2', '#E5F5E6', '#DDF1DF', '#D2EBD4', '#C4E5C6', '#A6D4AA', '#87C08E', '#70B078', '#5C9764', '#326239', '#1F4125'] },
  mem: { hue: 309.3, accent: '#B18CD0', deep: '#644879', wash: '#F5ECFD', skyTop: '#F0E1FD', skyBottom: '#FEF3FA', spark: '#B0C797', steps: ['#FBFAFD', '#F7F4FB', '#F5ECFD', '#F1E5FC', '#ECDCF9', '#E5D1F6', '#D4B9EB', '#C19FDC', '#B18CD0', '#9876B3', '#644879', '#422F51'] },
  mon: { hue: 277.6, accent: '#8E98DF', deep: '#4A5084', wash: '#ECEFFF', skyTop: '#E2E6FF', skyBottom: '#F9F4FF', spark: '#CABF8B', steps: ['#F9FAFE', '#F4F5FC', '#ECEFFF', '#E6EAFF', '#DCE1FF', '#D1D8FF', '#B9C2F7', '#A1AAE9', '#8E98DF', '#7880C1', '#4A5084', '#303458'] },
  mort: { hue: 289.0, accent: '#9C93DB', deep: '#544D82', wash: '#EFEEFF', skyTop: '#E6E5FF', skyBottom: '#FBF4FD', spark: '#C1C28D', steps: ['#FAFAFE', '#F5F4FC', '#EFEEFF', '#EAE8FF', '#E2DFFE', '#D9D5FD', '#C3BEF4', '#ADA6E6', '#9C93DB', '#857CBE', '#544D82', '#373257'] },
  nat: { hue: 139.4, accent: '#7BAE6E', deep: '#3B6132', wash: '#E8F4E4', skyTop: '#DBEFD6', skyBottom: '#EEFAF5', spark: '#D2B0DB', steps: ['#F9FBF8', '#F2F7F1', '#E8F4E4', '#E0F0DC', '#D5EBD0', '#C9E4C2', '#ADD2A4', '#91BE85', '#7BAE6E', '#67955B', '#3B6132', '#26401F'] },
  nom: { hue: 102.1, accent: '#BEB461', deep: '#60570A', wash: '#F3F1DE', skyTop: '#EDE9CB', skyBottom: '#F3F9EF', spark: '#B6B9EA', steps: ['#FBFBF7', '#F7F6EE', '#F3F1DE', '#EFECD4', '#E8E5C5', '#E1DCB4', '#CFC88F', '#BBB26B', '#BEB461', '#92883D', '#60570A', '#3F390B'] },
  nov: { hue: 263.1, accent: '#7C9EE0', deep: '#3C5485', wash: '#E8F0FF', skyTop: '#DCE8FF', skyBottom: '#F7F5FF', spark: '#D4BA8A', steps: ['#F9FAFE', '#F2F6FC', '#E8F0FF', '#E1EBFF', '#D5E4FF', '#C8DBFF', '#ACC6F7', '#91AFEA', '#7C9EE0', '#6786C2', '#3C5485', '#273759'] },
  numer: { hue: 174.7, accent: '#49B39A', deep: '#016553', wash: '#E0F6EF', skyTop: '#CDF1E6', skyBottom: '#ECFAFB', spark: '#E3ACC0', steps: ['#F7FCFA', '#EFF8F5', '#E0F6EF', '#D6F2E9', '#C7EDE1', '#B6E7D8', '#91D6C3', '#6BC3AB', '#49B39A', '#379A83', '#016553', '#034336'] },
  par: { hue: 27.4, accent: '#D8847A', deep: '#7E413B', wash: '#FFEAE7', skyTop: '#FFE0DB', skyBottom: '#FFF5ED', spark: '#87CBD5', steps: ['#FEF9F9', '#FCF3F2', '#FFEAE7', '#FFE4E0', '#FED9D4', '#FCCEC7', '#F3B4AB', '#E4998F', '#D8847A', '#BA6F66', '#7E413B', '#542A26'] },
  part: { hue: 75.8, accent: '#D8A861', deep: '#724D0B', wash: '#FAEEDE', skyTop: '#F8E5CB', skyBottom: '#F8F8EC', spark: '#A0C0EB', steps: ['#FCFAF7', '#F9F5EE', '#FAEEDE', '#F8E8D4', '#F4E0C5', '#F0D6B3', '#E2C08F', '#D1A76B', '#D8A861', '#A87E3C', '#724D0B', '#4B330C'] },
  pati: { hue: 17.5, accent: '#D78286', deep: '#7E4044', wash: '#FFEAEA', skyTop: '#FFDFDF', skyBottom: '#FFF4EF', spark: '#86CCCE', steps: ['#FEF9F9', '#FCF3F3', '#FFEAEA', '#FFE3E3', '#FED9D9', '#FCCDCD', '#F3B3B4', '#E4979A', '#D78286', '#BA6D71', '#7E4044', '#542A2C'] },
  pel: { hue: 250.6, accent: '#6BA3DD', deep: '#2E5883', wash: '#E5F1FF', skyTop: '#D7EAFF', skyBottom: '#F5F6FF', spark: '#DBB78D', steps: ['#F8FBFE', '#F1F6FC', '#E5F1FF', '#DCEDFF', '#CFE6FF', '#C1DEFE', '#A2CAF5', '#83B4E8', '#6BA3DD', '#578AC0', '#2E5883', '#1D3A58'] },
  pet: { hue: 355.1, accent: '#D282A1', deep: '#7A4058', wash: '#FFE9F0', skyTop: '#FFDDE9', skyBottom: '#FFF4F3', spark: '#8DCDBB', steps: ['#FDF9FA', '#FBF3F6', '#FFE9F0', '#FEE3EC', '#FBD8E4', '#F9CCDC', '#EEB2C8', '#DE97B2', '#D282A1', '#B56D89', '#7A4058', '#51293A'] },
  ple: { hue: 84.4, accent: '#D0AC5F', deep: '#6D5106', wash: '#F8EFDD', skyTop: '#F4E6CA', skyBottom: '#F6F8ED', spark: '#A7BEEC', steps: ['#FCFAF7', '#F9F5EE', '#F8EFDD', '#F5EAD3', '#F0E2C4', '#EBD8B2', '#DDC28E', '#CBAB69', '#D0AC5F', '#A2813A', '#6D5106', '#473509'] },
  prehend: { hue: 49.7, accent: '#D38A61', deep: '#7B4627', wash: '#FFEBE1', skyTop: '#FFE1D1', skyBottom: '#FCF6EC', spark: '#8FC7E2', steps: ['#FDF9F7', '#FBF4F0', '#FFEBE1', '#FEE5D8', '#FCDCCB', '#F9D1BB', '#EFB89B', '#DF9E7A', '#D38A61', '#B6744F', '#7B4627', '#522E18'] },
  quer: { hue: 102.0, accent: '#BEB461', deep: '#60570A', wash: '#F3F1DE', skyTop: '#EDE9CB', skyBottom: '#F3F9EF', spark: '#B6B9EA', steps: ['#FBFBF7', '#F7F6EE', '#F3F1DE', '#EFECD4', '#E8E5C5', '#E1DCB4', '#CFC88F', '#BBB26B', '#BEB461', '#92883C', '#60570A', '#3F390B'] },
  sci: { hue: 307.1, accent: '#AF8CD1', deep: '#62487A', wash: '#F4ECFD', skyTop: '#EFE1FD', skyBottom: '#FEF3FA', spark: '#B1C796', steps: ['#FBFAFD', '#F7F4FB', '#F4ECFD', '#F0E6FC', '#EBDCFA', '#E4D2F7', '#D2B9EC', '#BFA0DD', '#AF8CD1', '#9676B5', '#62487A', '#412F52'] },
  sec: { hue: 135.4, accent: '#81AD6A', deep: '#40602E', wash: '#E9F4E3', skyTop: '#DDEED4', skyBottom: '#EEFAF4', spark: '#CFB1DD', steps: ['#F9FBF8', '#F3F7F0', '#E9F4E3', '#E2F0DB', '#D7EACE', '#CBE3C0', '#B1D1A1', '#96BD82', '#81AD6A', '#6C9457', '#40602E', '#293F1D'] },
  serv: { hue: 74.4, accent: '#D9A762', deep: '#734D0C', wash: '#FAEEDE', skyTop: '#F8E5CB', skyBottom: '#F8F8EC', spark: '#9FC1EB', steps: ['#FCFAF7', '#FAF5EE', '#FAEEDE', '#F8E8D4', '#F4E0C5', '#F0D6B4', '#E3BF8F', '#D2A76B', '#D9A762', '#A97D3D', '#734D0C', '#4B330C'] },
  sign: { hue: 31.0, accent: '#D78576', deep: '#7E4238', wash: '#FFEBE7', skyTop: '#FFE0DA', skyBottom: '#FFF5ED', spark: '#87CAD7', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE7', '#FFE4DE', '#FEDAD3', '#FCCEC5', '#F2B4A8', '#E3998C', '#D78576', '#BA6F62', '#7E4238', '#542B24'] },
  simil: { hue: 346.5, accent: '#CE83AB', deep: '#77415F', wash: '#FDE9F3', skyTop: '#FDDEED', skyBottom: '#FFF4F4', spark: '#92CDB4', steps: ['#FDF9FB', '#FBF3F7', '#FDE9F3', '#FCE3EF', '#F9D9E9', '#F6CDE2', '#EBB3D0', '#DB98BB', '#CE83AB', '#B16E92', '#77415F', '#4F2A3F'] },
  solv: { hue: 158.7, accent: '#5FB286', deep: '#226444', wash: '#E3F5EA', skyTop: '#D2F1DE', skyBottom: '#ECFAF9', spark: '#DDADCD', steps: ['#F8FBF9', '#F0F8F3', '#E3F5EA', '#DAF2E3', '#CDECD9', '#BDE6CD', '#9CD5B4', '#7BC19A', '#5FB286', '#4C9870', '#226444', '#15422C'] },
  son: { hue: 274.5, accent: '#8A99DF', deep: '#475185', wash: '#EBEFFF', skyTop: '#E1E7FF', skyBottom: '#F9F5FF', spark: '#CCBE8A', steps: ['#F9FAFE', '#F3F5FC', '#EBEFFF', '#E5EAFF', '#DBE2FF', '#CFD9FF', '#B7C3F7', '#9DABEA', '#8A99DF', '#7582C2', '#475185', '#2E3559'] },
  sum: { hue: 71.2, accent: '#DBA663', deep: '#744C0F', wash: '#FBEDDE', skyTop: '#F9E4CC', skyBottom: '#F9F7EC', spark: '#9DC2EA', steps: ['#FDFAF7', '#FAF4EE', '#FBEDDE', '#F9E8D4', '#F6DFC6', '#F2D5B4', '#E5BE90', '#D4A66D', '#DBA663', '#AB7C3F', '#744C0F', '#4C320D'] },
  tang: { hue: 29.3, accent: '#D88478', deep: '#7E4239', wash: '#FFEBE7', skyTop: '#FFE0DA', skyBottom: '#FFF5ED', spark: '#87CBD6', steps: ['#FEF9F8', '#FCF3F2', '#FFEBE7', '#FFE4DF', '#FEDAD3', '#FCCEC6', '#F3B4AA', '#E4998D', '#D88478', '#BA6F64', '#7E4239', '#542B25'] },
  terr: { hue: 35.4, accent: '#D78671', deep: '#7E4334', wash: '#FFEBE5', skyTop: '#FFE0D8', skyBottom: '#FEF5ED', spark: '#88CADA', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE5', '#FFE4DD', '#FEDAD1', '#FCCFC3', '#F2B5A5', '#E39A87', '#D78671', '#B9705D', '#7E4334', '#542B21'] },
  tort: { hue: 44.8, accent: '#D48866', deep: '#7C452B', wash: '#FFEBE3', skyTop: '#FFE1D3', skyBottom: '#FDF6EC', spark: '#8CC8E0', steps: ['#FEF9F8', '#FCF3F0', '#FFEBE3', '#FEE5DA', '#FDDBCD', '#FAD0BE', '#F0B79E', '#E19D7E', '#D48866', '#B77354', '#7C452B', '#532D1B'] },
  val: { hue: 144.9, accent: '#73AF75', deep: '#356237', wash: '#E6F5E6', skyTop: '#D8EFD8', skyBottom: '#EDFAF6', spark: '#D5AFD7', steps: ['#F8FBF8', '#F1F7F1', '#E6F5E6', '#DEF1DE', '#D3EBD2', '#C5E4C5', '#A8D3A8', '#8ABF8B', '#73AF75', '#5F9661', '#356237', '#224123'] },
  vinc: { hue: 323.8, accent: '#BE87C3', deep: '#6C4470', wash: '#F9EAFA', skyTop: '#F6DFF7', skyBottom: '#FFF3F7', spark: '#A3CAA1', steps: ['#FCF9FC', '#F9F3F9', '#F9EAFA', '#F6E4F7', '#F2DAF4', '#EDCFEF', '#DEB6E2', '#CC9BD1', '#BE87C3', '#A472A8', '#6C4470', '#482C4B'] },
  viv: { hue: 139.3, accent: '#7BAE6E', deep: '#3B6131', wash: '#E8F4E4', skyTop: '#DBEFD5', skyBottom: '#EEFAF5', spark: '#D2B0DB', steps: ['#F9FBF8', '#F2F7F1', '#E8F4E4', '#E0F0DC', '#D5EBD0', '#C9E4C2', '#ADD2A4', '#91BE85', '#7BAE6E', '#67955B', '#3B6131', '#26401F'] },
  volv: { hue: 90.4, accent: '#CBAE5E', deep: '#695305', wash: '#F6F0DD', skyTop: '#F2E7CA', skyBottom: '#F5F8ED', spark: '#ACBCEC', steps: ['#FCFAF7', '#F8F5EE', '#F6F0DD', '#F3EAD3', '#EEE3C4', '#E8DAB2', '#D8C48E', '#C5AD69', '#CBAE5E', '#9D843A', '#695305', '#453609'] },
  fid: { hue: 257.4, accent: '#74A0DF', deep: '#365684', wash: '#E7F1FF', skyTop: '#DAE9FF', skyBottom: '#F6F6FF', spark: '#D7B98B', steps: ['#F8FBFE', '#F1F6FC', '#E7F1FF', '#DFECFF', '#D3E5FF', '#C4DCFF', '#A7C8F7', '#8AB1E9', '#74A0DF', '#6088C1', '#365684', '#223958'] },
  temp: { hue: 197.4, accent: '#37B2B5', deep: '#006264', wash: '#DEF5F6', skyTop: '#CAF1F1', skyBottom: '#EDF9FF', spark: '#E7ACAD', steps: ['#F7FBFC', '#EEF8F8', '#DEF5F6', '#D3F2F2', '#C4ECED', '#B1E6E7', '#89D5D7', '#5FC1C4', '#37B2B5', '#22989B', '#006264', '#004143'] },
  ver: { hue: 95.8, accent: '#C5B15F', deep: '#655506', wash: '#F5F0DE', skyTop: '#F0E8CB', skyBottom: '#F4F9EE', spark: '#B1BBEB', steps: ['#FBFAF7', '#F7F6EE', '#F5F0DE', '#F1EBD3', '#EBE4C5', '#E5DBB3', '#D4C68E', '#C1AF6A', '#C5B15F', '#98863A', '#655506', '#42380A'] },
  jud: { hue: 264.4, accent: '#7D9DE0', deep: '#3D5485', wash: '#E9F0FF', skyTop: '#DDE8FF', skyBottom: '#F7F5FF', spark: '#D3BB8A', steps: ['#F9FAFE', '#F2F6FC', '#E9F0FF', '#E1EBFF', '#D6E4FF', '#C9DBFF', '#AEC6F7', '#92AFEA', '#7D9DE0', '#6985C2', '#3D5485', '#283759'] },
  jur: { hue: 162.9, accent: '#59B38B', deep: '#1C6448', wash: '#E2F5EB', skyTop: '#D1F1E0', skyBottom: '#ECFAF9', spark: '#DFACCA', steps: ['#F8FBF9', '#F0F8F3', '#E2F5EB', '#D9F2E5', '#CBEDDB', '#BBE6D0', '#99D6B8', '#76C29E', '#59B38B', '#479975', '#1C6448', '#11422F'] },
  liber: { hue: 26.1, accent: '#D8847C', deep: '#7E413C', wash: '#FFEAE8', skyTop: '#FFDFDC', skyBottom: '#FFF5EE', spark: '#87CBD4', steps: ['#FEF9F9', '#FCF3F2', '#FFEAE8', '#FFE4E0', '#FED9D5', '#FCCDC8', '#F3B4AC', '#E49991', '#D8847C', '#BA6E67', '#7E413C', '#542A27'] },
  grav: { hue: 321.1, accent: '#BC88C6', deep: '#6B4572', wash: '#F8EBFA', skyTop: '#F5E0F8', skyBottom: '#FFF3F8', spark: '#A5CA9F', steps: ['#FCF9FC', '#F9F3FA', '#F8EBFA', '#F5E4F8', '#F1DBF5', '#EBCFF1', '#DDB6E4', '#CA9CD3', '#BC88C6', '#A272AA', '#6B4572', '#472D4C'] },
  lev: { hue: 89.2, accent: '#CCAE5E', deep: '#695205', wash: '#F6EFDD', skyTop: '#F2E7CA', skyBottom: '#F5F8ED', spark: '#ABBCEC', steps: ['#FCFAF7', '#F8F5EE', '#F6EFDD', '#F3EAD3', '#EEE3C4', '#E9D9B2', '#D9C48E', '#C6AD69', '#CCAE5E', '#9E833A', '#695205', '#453609'] },
  fort: { hue: 75.5, accent: '#D8A861', deep: '#724D0B', wash: '#FAEEDE', skyTop: '#F8E5CB', skyBottom: '#F8F8EC', spark: '#A0C0EB', steps: ['#FCFAF7', '#F9F5EE', '#FAEEDE', '#F8E8D4', '#F4E0C5', '#F0D6B3', '#E2C08F', '#D1A76B', '#D8A861', '#A97E3D', '#724D0B', '#4B330C'] },
  nav: { hue: 254.0, accent: '#6FA1DE', deep: '#325784', wash: '#E6F1FF', skyTop: '#D9EAFF', skyBottom: '#F5F6FF', spark: '#D9B88C', steps: ['#F8FBFE', '#F1F6FC', '#E6F1FF', '#DEECFF', '#D1E5FF', '#C2DDFE', '#A4C9F6', '#86B2E9', '#6FA1DE', '#5C89C0', '#325784', '#203958'] },
  vol: { hue: 101.6, accent: '#BFB361', deep: '#60570A', wash: '#F3F1DE', skyTop: '#EDE9CB', skyBottom: '#F3F9EF', spark: '#B6B9EA', steps: ['#FBFBF7', '#F7F6EE', '#F3F1DE', '#EFECD4', '#E9E5C5', '#E1DCB4', '#CFC88F', '#BBB16B', '#BFB361', '#93883C', '#60570A', '#3F390B'] },
  cogn: { hue: 90.9, accent: '#CAAF5E', deep: '#685305', wash: '#F6F0DD', skyTop: '#F2E7CA', skyBottom: '#F5F9ED', spark: '#ADBCEC', steps: ['#FCFAF7', '#F8F5EE', '#F6F0DD', '#F3EBD3', '#EEE3C4', '#E8DAB2', '#D8C48E', '#C5AD69', '#CAAF5E', '#9D843A', '#685305', '#443709'] },
  grat: { hue: 22.7, accent: '#D88380', deep: '#7E413F', wash: '#FFEAE9', skyTop: '#FFDFDD', skyBottom: '#FFF4EE', spark: '#86CCD1', steps: ['#FEF9F9', '#FCF3F2', '#FFEAE9', '#FFE3E1', '#FED9D6', '#FDCDCA', '#F3B3AF', '#E49894', '#D88380', '#BA6E6B', '#7E413F', '#542A29'] },
  mar: { hue: 267.4, accent: '#819CE0', deep: '#415385', wash: '#E9F0FF', skyTop: '#DEE8FF', skyBottom: '#F7F5FF', spark: '#D1BC8A', steps: ['#F9FAFE', '#F2F5FC', '#E9F0FF', '#E2EBFF', '#D7E3FF', '#CBDAFF', '#B0C5F7', '#95AEEA', '#819CE0', '#6C84C2', '#415385', '#2A3759'] },
  equ: { hue: 231.6, accent: '#51A9D4', deep: '#125D7C', wash: '#E0F3FE', skyTop: '#CEEDFE', skyBottom: '#F2F7FF', spark: '#E3B295', steps: ['#F7FBFD', '#EFF7FB', '#E0F3FE', '#D6EFFD', '#C8E9FB', '#B7E2F8', '#94CFEE', '#6FBADF', '#51A9D4', '#3E91B7', '#125D7C', '#0B3E53'] },
  phys: { hue: 139.7, accent: '#7BAE6F', deep: '#3B6132', wash: '#E7F4E4', skyTop: '#DAEFD6', skyBottom: '#EEFAF5', spark: '#D2B0DA', steps: ['#F9FBF8', '#F2F7F1', '#E7F4E4', '#E0F1DC', '#D5EBD0', '#C8E4C2', '#ADD2A4', '#90BE86', '#7BAE6F', '#66955B', '#3B6132', '#264020'] },
  tele: { hue: 54.7, accent: '#D18C5D', deep: '#794723', wash: '#FEECE0', skyTop: '#FEE2CF', skyBottom: '#FBF6EC', spark: '#91C6E5', steps: ['#FDFAF7', '#FBF4EF', '#FEECE0', '#FDE6D7', '#FADDC9', '#F8D2B9', '#EDB998', '#DDA076', '#D18C5D', '#B4764A', '#794723', '#512E15'] },
  scop: { hue: 241.6, accent: '#5EA6DA', deep: '#225B80', wash: '#E2F2FF', skyTop: '#D3ECFF', skyBottom: '#F4F7FF', spark: '#DFB490', steps: ['#F8FBFE', '#F0F6FC', '#E2F2FF', '#D9EEFF', '#CCE8FD', '#BCE0FC', '#9ACCF3', '#79B7E5', '#5EA6DA', '#4B8DBC', '#225B80', '#153C56'] },
  micro: { hue: 140.6, accent: '#7AAE70', deep: '#3A6133', wash: '#E7F4E5', skyTop: '#DAEFD6', skyBottom: '#EDFAF5', spark: '#D3B0DA', steps: ['#F9FBF8', '#F2F7F1', '#E7F4E5', '#E0F1DD', '#D5EBD1', '#C8E4C2', '#ACD2A5', '#8FBE87', '#7AAE70', '#65955C', '#3A6133', '#254020'] },
  mult: { hue: 11.4, accent: '#D7828D', deep: '#7D4049', wash: '#FFEAEC', skyTop: '#FFDFE2', skyBottom: '#FFF4F0', spark: '#87CDC9', steps: ['#FEF9F9', '#FCF3F4', '#FFEAEC', '#FFE3E5', '#FED8DC', '#FCCCD1', '#F2B2B9', '#E397A0', '#D7828D', '#B96D77', '#7D4049', '#542930'] },
  omni: { hue: 139.5, accent: '#7BAE6E', deep: '#3B6132', wash: '#E7F4E4', skyTop: '#DBEFD6', skyBottom: '#EEFAF5', spark: '#D2B0DA', steps: ['#F9FBF8', '#F2F7F1', '#E7F4E4', '#E0F0DC', '#D5EBD0', '#C9E4C2', '#ADD2A4', '#91BE86', '#7BAE6E', '#67955B', '#3B6132', '#26401F'] },
  uni: { hue: 299.6, accent: '#A88FD6', deep: '#5D4A7E', wash: '#F2ECFF', skyTop: '#EBE3FF', skyBottom: '#FDF3FC', spark: '#B8C592', steps: ['#FBFAFD', '#F6F4FB', '#F2ECFF', '#EEE7FE', '#E7DEFC', '#DFD3FA', '#CCBBF0', '#B8A2E2', '#A88FD6', '#8F79B9', '#5D4A7E', '#3D3054'] },
  ann: { hue: 265.8, accent: '#7F9CE0', deep: '#3F5485', wash: '#E9F0FF', skyTop: '#DDE8FF', skyBottom: '#F7F5FF', spark: '#D2BB8A', steps: ['#F9FAFE', '#F2F5FC', '#E9F0FF', '#E2EBFF', '#D7E3FF', '#CADAFF', '#AFC5F7', '#94AEEA', '#7F9CE0', '#6A85C2', '#3F5485', '#293759'] },
  doc: { hue: 1.6, accent: '#D48299', deep: '#7C4052', wash: '#FFE9EE', skyTop: '#FFDEE6', skyBottom: '#FFF4F2', spark: '#8ACDC1', steps: ['#FEF9FA', '#FCF3F5', '#FFE9EE', '#FFE2E9', '#FDD8E1', '#FACCD8', '#F0B2C2', '#E197AB', '#D48299', '#B76C82', '#7C4052', '#532936'] },
  prim: { hue: 26.8, accent: '#D8847B', deep: '#7E413B', wash: '#FFEAE8', skyTop: '#FFE0DB', skyBottom: '#FFF5ED', spark: '#87CBD4', steps: ['#FEF9F9', '#FCF3F2', '#FFEAE8', '#FFE4E0', '#FED9D4', '#FCCEC7', '#F3B4AC', '#E49990', '#D8847B', '#BA6E66', '#7E413B', '#542A26'] },
  magn: { hue: 23.4, accent: '#D8837F', deep: '#7E413F', wash: '#FFEAE9', skyTop: '#FFDFDD', skyBottom: '#FFF4EE', spark: '#86CBD2', steps: ['#FEF9F9', '#FCF3F2', '#FFEAE9', '#FFE3E1', '#FED9D6', '#FDCDCA', '#F3B3AF', '#E49893', '#D8837F', '#BA6E6A', '#7E413F', '#542A28'] },
  patr: { hue: 20.1, accent: '#D88383', deep: '#7E4142', wash: '#FFEAE9', skyTop: '#FFDFDE', skyBottom: '#FFF4EF', spark: '#86CCD0', steps: ['#FEF9F9', '#FCF3F3', '#FFEAE9', '#FFE3E2', '#FED9D8', '#FCCDCC', '#F3B3B2', '#E49897', '#D88383', '#BA6D6E', '#7E4142', '#542A2A'] },
  matr: { hue: 29.5, accent: '#D88477', deep: '#7E4239', wash: '#FFEBE7', skyTop: '#FFE0DA', skyBottom: '#FFF5ED', spark: '#87CBD6', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE7', '#FFE4DF', '#FEDAD3', '#FCCEC6', '#F3B4AA', '#E4998D', '#D88477', '#BA6F63', '#7E4239', '#542B24'] },
  pop: { hue: 33.1, accent: '#D78573', deep: '#7E4236', wash: '#FFEBE6', skyTop: '#FFE0D9', skyBottom: '#FEF5ED', spark: '#88CAD9', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE6', '#FFE4DE', '#FEDAD2', '#FCCEC4', '#F2B5A7', '#E39A89', '#D78573', '#BA705F', '#7E4236', '#542B22'] },
  pac: { hue: 250.1, accent: '#6AA3DD', deep: '#2D5883', wash: '#E5F1FF', skyTop: '#D7EAFF', skyBottom: '#F5F6FF', spark: '#DBB68D', steps: ['#F8FBFE', '#F1F6FC', '#E5F1FF', '#DCEDFF', '#CFE6FF', '#C0DEFE', '#A1CAF5', '#82B4E8', '#6AA3DD', '#578ABF', '#2D5883', '#1D3A58'] },
  mut: { hue: 151.7, accent: '#6AB17D', deep: '#2C633D', wash: '#E4F5E8', skyTop: '#D5F0DB', skyBottom: '#EDFAF7', spark: '#D9AED2', steps: ['#F8FBF9', '#F1F7F2', '#E4F5E8', '#DCF1E0', '#D0ECD6', '#C1E5C9', '#A2D4AE', '#82C092', '#6AB17D', '#569768', '#2C633D', '#1C4127'] },
  auto: { hue: 286.7, accent: '#9994DC', deep: '#524E82', wash: '#EEEEFF', skyTop: '#E5E5FF', skyBottom: '#FBF4FE', spark: '#C3C18D', steps: ['#FAFAFE', '#F5F5FC', '#EEEEFF', '#E9E8FF', '#E1E0FF', '#D7D6FD', '#C1BFF5', '#ABA7E7', '#9994DC', '#827DBF', '#524E82', '#363357'] },
  min: { hue: 32.7, accent: '#D78574', deep: '#7E4236', wash: '#FFEBE6', skyTop: '#FFE0D9', skyBottom: '#FFF5ED', spark: '#88CAD8', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE6', '#FFE4DE', '#FEDAD2', '#FCCEC4', '#F2B5A7', '#E39A8A', '#D78574', '#BA7060', '#7E4236', '#542B23'] },
  ord: { hue: 257.5, accent: '#74A0DF', deep: '#365684', wash: '#E7F1FF', skyTop: '#DAE9FF', skyBottom: '#F6F6FF', spark: '#D7B98B', steps: ['#F8FBFE', '#F1F6FC', '#E7F1FF', '#DFECFF', '#D3E5FF', '#C5DCFF', '#A7C8F7', '#8AB1E9', '#74A0DF', '#6088C1', '#365684', '#223958'] },
  oper: { hue: 199.2, accent: '#36B2B7', deep: '#006266', wash: '#DDF5F6', skyTop: '#CAF1F2', skyBottom: '#EDF9FF', spark: '#E8ACAC', steps: ['#F7FBFC', '#EEF8F8', '#DDF5F6', '#D3F2F3', '#C4ECEE', '#B1E6E8', '#89D5D8', '#5FC1C5', '#36B2B7', '#22989D', '#006266', '#004144'] },
  plac: { hue: 11.1, accent: '#D7828E', deep: '#7D404A', wash: '#FFEAEC', skyTop: '#FFDFE2', skyBottom: '#FFF4F0', spark: '#87CDC8', steps: ['#FEF9F9', '#FCF3F4', '#FFEAEC', '#FFE3E6', '#FED8DC', '#FCCCD1', '#F2B2BA', '#E397A1', '#D7828E', '#B96D78', '#7D404A', '#542930'] },
  medi: { hue: 197.8, accent: '#37B2B5', deep: '#006265', wash: '#DEF5F6', skyTop: '#CAF1F1', skyBottom: '#EDF9FF', spark: '#E7ACAD', steps: ['#F7FBFC', '#EEF8F8', '#DEF5F6', '#D3F2F2', '#C4ECED', '#B1E6E7', '#89D5D7', '#5FC1C4', '#37B2B5', '#22989B', '#006265', '#004143'] },
  rat: { hue: 258.7, accent: '#769FDF', deep: '#375684', wash: '#E7F1FF', skyTop: '#DBE9FF', skyBottom: '#F6F6FF', spark: '#D6B98B', steps: ['#F8FBFE', '#F1F6FC', '#E7F1FF', '#DFECFF', '#D3E5FF', '#C5DCFF', '#A8C8F7', '#8CB1EA', '#769FDF', '#6287C1', '#375684', '#233859'] },
  rad: { hue: 153.6, accent: '#67B17F', deep: '#2A633F', wash: '#E4F5E8', skyTop: '#D4F0DC', skyBottom: '#ECFAF8', spark: '#DAADD1', steps: ['#F8FBF9', '#F1F8F2', '#E4F5E8', '#DBF2E1', '#CFECD7', '#C0E5CA', '#A0D5AF', '#80C194', '#67B17F', '#53986B', '#2A633F', '#1A4229'] },
  sacr: { hue: 311.6, accent: '#B48BCE', deep: '#654778', wash: '#F5EBFC', skyTop: '#F1E1FC', skyBottom: '#FEF3FA', spark: '#AEC899', steps: ['#FBF9FD', '#F8F4FA', '#F5EBFC', '#F2E5FB', '#EDDCF8', '#E6D1F5', '#D6B8EA', '#C39FDA', '#B48BCE', '#9A75B2', '#654778', '#432E50'] },
  sal: { hue: 198.8, accent: '#36B2B6', deep: '#006265', wash: '#DDF5F6', skyTop: '#CAF1F2', skyBottom: '#EDF9FF', spark: '#E8ACAC', steps: ['#F7FBFC', '#EEF8F8', '#DDF5F6', '#D3F2F3', '#C4ECEE', '#B1E6E8', '#89D5D8', '#5FC1C5', '#36B2B6', '#22989C', '#006265', '#004143'] },
  scend: { hue: 260.7, accent: '#789EDF', deep: '#3A5585', wash: '#E8F0FF', skyTop: '#DBE9FF', skyBottom: '#F6F5FF', spark: '#D5BA8A', steps: ['#F8FAFE', '#F2F6FC', '#E8F0FF', '#E0ECFF', '#D4E4FF', '#C6DCFF', '#AAC7F7', '#8EB0EA', '#789EDF', '#6487C2', '#3A5585', '#253859'] },
  sed: { hue: 13.6, accent: '#D7828B', deep: '#7E4047', wash: '#FFEAEB', skyTop: '#FFDFE1', skyBottom: '#FFF4F0', spark: '#87CCCA', steps: ['#FEF9F9', '#FCF3F3', '#FFEAEB', '#FFE3E5', '#FED9DB', '#FCCDD0', '#F2B2B7', '#E3979E', '#D7828B', '#BA6D75', '#7E4047', '#54292E'] },
  sol: { hue: 252.0, accent: '#6CA2DE', deep: '#305883', wash: '#E5F1FF', skyTop: '#D8EAFF', skyBottom: '#F5F6FF', spark: '#DAB78C', steps: ['#F8FBFE', '#F1F6FC', '#E5F1FF', '#DDEDFF', '#D0E6FF', '#C1DEFE', '#A3CAF6', '#84B3E8', '#6CA2DE', '#598AC0', '#305883', '#1E3A58'] },
  string: { hue: 200.5, accent: '#36B1B8', deep: '#006267', wash: '#DDF5F7', skyTop: '#CAF1F3', skyBottom: '#EDF9FF', spark: '#E8ACAB', steps: ['#F7FBFC', '#EEF8F8', '#DDF5F7', '#D3F2F3', '#C4ECEE', '#B1E6E9', '#89D5D9', '#5FC1C7', '#36B1B8', '#22989E', '#006267', '#004144'] },
  tex: { hue: 306.9, accent: '#AF8DD1', deep: '#62487A', wash: '#F4ECFD', skyTop: '#EFE1FD', skyBottom: '#FEF3FA', spark: '#B2C796', steps: ['#FBFAFD', '#F7F4FB', '#F4ECFD', '#F0E6FC', '#EADDFA', '#E4D2F7', '#D2B9EC', '#BEA0DD', '#AF8DD1', '#9676B5', '#62487A', '#412F52'] },
  mod: { hue: 263.5, accent: '#7C9DE0', deep: '#3D5485', wash: '#E8F0FF', skyTop: '#DCE8FF', skyBottom: '#F7F5FF', spark: '#D3BA8A', steps: ['#F9FAFE', '#F2F6FC', '#E8F0FF', '#E1EBFF', '#D6E4FF', '#C8DBFF', '#ADC6F7', '#91AFEA', '#7C9DE0', '#6886C2', '#3D5485', '#273759'] },
  prob: { hue: 310.8, accent: '#B38BCE', deep: '#654778', wash: '#F5EBFD', skyTop: '#F0E1FC', skyBottom: '#FEF3FA', spark: '#AEC798', steps: ['#FBF9FD', '#F8F4FB', '#F5EBFD', '#F2E5FB', '#ECDCF9', '#E6D1F5', '#D5B9EA', '#C29FDB', '#B38BCE', '#9975B2', '#654778', '#432E50'] },
  punct: { hue: 42.1, accent: '#D58869', deep: '#7D442E', wash: '#FFEBE3', skyTop: '#FFE0D5', skyBottom: '#FDF5EC', spark: '#8BC8DE', steps: ['#FEF9F8', '#FCF3F0', '#FFEBE3', '#FFE4DA', '#FDDBCE', '#FBD0BF', '#F1B6A0', '#E19C81', '#D58869', '#B87256', '#7D442E', '#532C1D'] },
  spond: { hue: 13.2, accent: '#D7828B', deep: '#7E4048', wash: '#FFEAEB', skyTop: '#FFDFE1', skyBottom: '#FFF4F0', spark: '#87CCCA', steps: ['#FEF9F9', '#FCF3F3', '#FFEAEB', '#FFE3E5', '#FED9DB', '#FCCDD0', '#F2B2B8', '#E3979E', '#D7828B', '#BA6D75', '#7E4048', '#54292F'] },
  trib: { hue: 261.2, accent: '#799EE0', deep: '#3A5585', wash: '#E8F0FF', skyTop: '#DCE9FF', skyBottom: '#F6F5FF', spark: '#D5BA8A', steps: ['#F8FAFE', '#F2F6FC', '#E8F0FF', '#E0ECFF', '#D4E4FF', '#C7DCFF', '#ABC7F7', '#8EB0EA', '#799EE0', '#6586C2', '#3A5585', '#253859'] },
  turb: { hue: 35.0, accent: '#D78671', deep: '#7E4334', wash: '#FFEBE5', skyTop: '#FFE0D8', skyBottom: '#FEF5ED', spark: '#88CADA', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE5', '#FFE4DD', '#FEDAD1', '#FCCFC3', '#F2B5A5', '#E39A88', '#D78671', '#BA705D', '#7E4334', '#542B21'] },
  urb: { hue: 261.4, accent: '#799EE0', deep: '#3A5585', wash: '#E8F0FF', skyTop: '#DCE9FF', skyBottom: '#F7F5FF', spark: '#D5BA8A', steps: ['#F8FAFE', '#F2F6FC', '#E8F0FF', '#E0ECFF', '#D5E4FF', '#C7DBFF', '#ABC7F7', '#8FB0EA', '#799EE0', '#6586C2', '#3A5585', '#253859'] },
  vac: { hue: 196.7, accent: '#37B2B4', deep: '#006264', wash: '#DEF5F5', skyTop: '#CAF1F1', skyBottom: '#EDF9FF', spark: '#E7ACAE', steps: ['#F7FBFB', '#EEF8F8', '#DEF5F5', '#D3F2F2', '#C4EDED', '#B1E6E6', '#8AD5D6', '#5FC1C3', '#37B2B4', '#23989A', '#006264', '#004142'] },
  vad: { hue: 18.5, accent: '#D88385', deep: '#7E4043', wash: '#FFEAEA', skyTop: '#FFDFDF', skyBottom: '#FFF4EF', spark: '#86CCCE', steps: ['#FEF9F9', '#FCF3F3', '#FFEAEA', '#FFE3E3', '#FED9D8', '#FCCDCD', '#F3B3B3', '#E49799', '#D88385', '#BA6D6F', '#7E4043', '#542A2B'] },
  via: { hue: 154.1, accent: '#66B180', deep: '#29633F', wash: '#E4F5E8', skyTop: '#D4F0DC', skyBottom: '#ECFAF8', spark: '#DAADD0', steps: ['#F8FBF9', '#F1F8F2', '#E4F5E8', '#DBF2E1', '#CFECD7', '#C0E6CB', '#A0D5B0', '#80C195', '#66B180', '#53986B', '#29633F', '#1A4229'] },
  capit: { hue: 33.8, accent: '#D78572', deep: '#7E4335', wash: '#FFEBE6', skyTop: '#FFE0D8', skyBottom: '#FEF5ED', spark: '#88CAD9', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE6', '#FFE4DD', '#FEDAD1', '#FCCEC3', '#F2B5A6', '#E39A89', '#D78572', '#BA705F', '#7E4335', '#542B22'] },
  clin: { hue: 309.9, accent: '#B28CCF', deep: '#644779', wash: '#F5ECFD', skyTop: '#F0E1FC', skyBottom: '#FEF3FA', spark: '#AFC798', steps: ['#FBF9FD', '#F7F4FB', '#F5ECFD', '#F1E5FB', '#ECDCF9', '#E5D1F6', '#D5B9EB', '#C19FDB', '#B28CCF', '#9975B3', '#644779', '#422E51'] },
  dent: { hue: 198.9, accent: '#36B2B7', deep: '#006266', wash: '#DDF5F6', skyTop: '#CAF1F2', skyBottom: '#EDF9FF', spark: '#E8ACAC', steps: ['#F7FBFC', '#EEF8F8', '#DDF5F6', '#D3F2F3', '#C4ECEE', '#B1E6E8', '#89D5D8', '#5FC1C5', '#36B2B7', '#22989D', '#006266', '#004143'] },
  dom: { hue: 17.3, accent: '#D78286', deep: '#7E4044', wash: '#FFEAEA', skyTop: '#FFDFDF', skyBottom: '#FFF4EF', spark: '#86CCCD', steps: ['#FEF9F9', '#FCF3F3', '#FFEAEA', '#FFE3E3', '#FED9D9', '#FCCDCD', '#F3B3B4', '#E4979A', '#D78286', '#BA6D71', '#7E4044', '#542A2C'] },
  clam: { hue: 261.4, accent: '#799EE0', deep: '#3A5585', wash: '#E8F0FF', skyTop: '#DCE9FF', skyBottom: '#F7F5FF', spark: '#D5BA8A', steps: ['#F8FAFE', '#F2F6FC', '#E8F0FF', '#E0ECFF', '#D5E4FF', '#C7DBFF', '#ABC7F7', '#8FB0EA', '#799EE0', '#6586C2', '#3A5585', '#253859'] },
  corp: { hue: 34.4, accent: '#D78672', deep: '#7E4335', wash: '#FFEBE6', skyTop: '#FFE0D8', skyBottom: '#FEF5ED', spark: '#88CADA', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE6', '#FFE4DD', '#FEDAD1', '#FCCEC3', '#F2B5A6', '#E39A88', '#D78672', '#BA705E', '#7E4335', '#542B21'] },
  soci: { hue: 152.7, accent: '#68B17E', deep: '#2B633E', wash: '#E4F5E8', skyTop: '#D5F0DB', skyBottom: '#ECFAF8', spark: '#DAAED1', steps: ['#F8FBF9', '#F1F7F2', '#E4F5E8', '#DCF1E1', '#CFECD6', '#C1E5CA', '#A1D4AF', '#81C093', '#68B17E', '#55986A', '#2B633E', '#1B4128'] },
  don: { hue: 260.0, accent: '#779FDF', deep: '#395585', wash: '#E7F0FF', skyTop: '#DBE9FF', skyBottom: '#F6F6FF', spark: '#D6B98A', steps: ['#F8FBFE', '#F2F6FC', '#E7F0FF', '#E0ECFF', '#D4E4FF', '#C6DCFF', '#AAC7F7', '#8DB0EA', '#779FDF', '#6387C1', '#395585', '#243859'] },
  fend: { hue: 260.0, accent: '#779FDF', deep: '#395585', wash: '#E7F0FF', skyTop: '#DBE9FF', skyBottom: '#F6F6FF', spark: '#D6B98A', steps: ['#F8FBFE', '#F2F6FC', '#E7F0FF', '#E0ECFF', '#D4E4FF', '#C6DCFF', '#AAC7F7', '#8DB0EA', '#779FDF', '#6387C1', '#395585', '#243859'] },
  flor: { hue: 17.5, accent: '#D78286', deep: '#7E4044', wash: '#FFEAEA', skyTop: '#FFDFDF', skyBottom: '#FFF4EF', spark: '#86CCCE', steps: ['#FEF9F9', '#FCF3F3', '#FFEAEA', '#FFE3E3', '#FED9D9', '#FCCDCD', '#F3B3B4', '#E4979A', '#D78286', '#BA6D71', '#7E4044', '#542A2C'] },
  fug: { hue: 203.1, accent: '#37B1BB', deep: '#006268', wash: '#DDF5F7', skyTop: '#CAF0F4', skyBottom: '#EEF9FF', spark: '#E8ADA9', steps: ['#F7FBFC', '#EEF8F8', '#DDF5F7', '#D3F2F4', '#C4ECF0', '#B1E6EA', '#89D5DB', '#5FC0C9', '#37B1BB', '#2397A1', '#006268', '#004146'] },
  greg: { hue: 152.1, accent: '#69B17E', deep: '#2C633D', wash: '#E4F5E8', skyTop: '#D5F0DB', skyBottom: '#EDFAF7', spark: '#D9AED2', steps: ['#F8FBF9', '#F1F7F2', '#E4F5E8', '#DCF1E1', '#D0ECD6', '#C1E5C9', '#A2D4AE', '#82C093', '#69B17E', '#569769', '#2C633D', '#1B4128'] },
  it: { hue: 32.1, accent: '#D78574', deep: '#7E4237', wash: '#FFEBE6', skyTop: '#FFE0D9', skyBottom: '#FFF5ED', spark: '#88CAD8', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE6', '#FFE4DE', '#FEDAD2', '#FCCEC4', '#F2B4A7', '#E39A8A', '#D78574', '#BA6F61', '#7E4237', '#542B23'] },
  cand: { hue: 306.5, accent: '#AF8DD2', deep: '#62487B', wash: '#F4ECFD', skyTop: '#EFE1FE', skyBottom: '#FEF3FB', spark: '#B2C796', steps: ['#FBFAFD', '#F7F4FB', '#F4ECFD', '#F0E6FC', '#EADDFA', '#E3D2F7', '#D2BAED', '#BEA0DE', '#AF8DD2', '#9676B5', '#62487B', '#412F52'] },
  nunci: { hue: 261.2, accent: '#799EE0', deep: '#3A5585', wash: '#E8F0FF', skyTop: '#DCE9FF', skyBottom: '#F6F5FF', spark: '#D5BA8A', steps: ['#F8FAFE', '#F2F6FC', '#E8F0FF', '#E0ECFF', '#D4E4FF', '#C7DCFF', '#ABC7F7', '#8EB0EA', '#799EE0', '#6586C2', '#3A5585', '#253859'] },
  pict: { hue: 36.1, accent: '#D78670', deep: '#7D4333', wash: '#FFEBE5', skyTop: '#FFE0D7', skyBottom: '#FEF5EC', spark: '#89CADB', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE5', '#FFE4DD', '#FEDAD0', '#FCCFC2', '#F2B5A4', '#E39A87', '#D78670', '#B9705C', '#7D4333', '#542B20'] },
  san: { hue: 201.9, accent: '#36B1BA', deep: '#006268', wash: '#DDF5F7', skyTop: '#CAF0F3', skyBottom: '#EEF9FF', spark: '#E8ACAA', steps: ['#F7FBFC', '#EEF8F8', '#DDF5F7', '#D3F2F4', '#C4ECEF', '#B1E6EA', '#89D5DA', '#5FC1C8', '#36B1BA', '#2298A0', '#006268', '#004145'] },
};

export function hasSampledColor(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(rootColors, id);
}

function hueGap(a: number, b: number): number {
  const gap = Math.abs(a - b) % 360;
  return Math.min(gap, 360 - gap);
}

/** Stable placeholder hue, nudged off every measured illustration hue. */
function provisionalHue(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 33 + id.charCodeAt(i)) % 3600;
  let hue = hash / 10;
  const taken = Object.values(rootColors).map((color) => color.hue);
  for (let n = 0; n < 12; n += 1) {
    if (!taken.some((other) => hueGap(other, hue) < 2.5)) break;
    hue = (hue + 3.7) % 360;
  }
  return Math.round(hue * 10) / 10;
}

/** OKLCH → sRGB hex. Placeholder ramps stay inside a quiet chroma so they don't imitate a sampled accent. */
function oklchToHex(L: number, C: number, H: number): string {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  const linear = [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  const hex = linear
    .map((channel) => {
      const clipped = Math.min(1, Math.max(0, channel));
      const encoded = clipped <= 0.0031308 ? 12.92 * clipped : 1.055 * clipped ** (1 / 2.4) - 0.055;
      return Math.round(Math.min(1, Math.max(0, encoded)) * 255)
        .toString(16)
        .padStart(2, '0');
    })
    .join('');
  return `#${hex.toUpperCase()}`;
}

function placeholderRamp(hue: number): RootColor {
  const levels = [0.985, 0.965, 0.945, 0.92, 0.89, 0.85, 0.78, 0.7, 0.64, 0.55, 0.42, 0.3];
  const chroma = [0.004, 0.008, 0.012, 0.016, 0.022, 0.03, 0.04, 0.048, 0.052, 0.046, 0.038, 0.028];
  const steps = levels.map((lightness, i) => oklchToHex(lightness, chroma[i] ?? 0.03, hue));
  return {
    hue,
    accent: steps[8] ?? '#8A8178',
    deep: steps[10] ?? '#5C5148',
    wash: steps[2] ?? '#F6EFE7',
    skyTop: steps[1] ?? '#F8F3ED',
    skyBottom: steps[0] ?? '#FBF8F4',
    spark: steps[5] ?? '#C4B8AA',
    steps,
  };
}

const placeholderCache = new Map<string, RootColor>();

export function rootColor(id: string): RootColor {
  const sampled = rootColors[id];
  if (sampled) return sampled;
  const cached = placeholderCache.get(id);
  if (cached) return cached;
  const ramp = placeholderRamp(provisionalHue(id));
  placeholderCache.set(id, ramp);
  return ramp;
}
