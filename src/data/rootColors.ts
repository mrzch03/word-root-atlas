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
  fer: { hue: 83.2, accent: '#D1AB5F', deep: '#6D5006', wash: '#F8EFDD', skyTop: '#F5E6CA', skyBottom: '#F6F8ED', spark: '#A6BEEC', steps: ['#FCFAF7', '#F9F5EE', '#F8EFDD', '#F5E9D3', '#F1E1C4', '#ECD8B3', '#DDC28E', '#CBAA69', '#D1AB5F', '#A3813A', '#6D5006', '#48350A'] },
  ten: { hue: 191.0, accent: '#39B3AE', deep: '#006360', wash: '#DEF6F4', skyTop: '#CAF1EE', skyBottom: '#ECF9FE', spark: '#E7ACB3', steps: ['#F7FCFB', '#EEF8F7', '#DEF6F4', '#D4F2F0', '#C4EDEA', '#B2E6E3', '#8BD6D1', '#61C2BD', '#39B3AE', '#259995', '#006360', '#00423F'] },
  fac: { hue: 49.2, accent: '#D38A62', deep: '#7B4628', wash: '#FFEBE1', skyTop: '#FFE1D1', skyBottom: '#FCF6EC', spark: '#8EC7E2', steps: ['#FDF9F7', '#FBF4F0', '#FFEBE1', '#FEE5D8', '#FCDCCB', '#F9D1BC', '#EFB89B', '#DF9E7B', '#D38A62', '#B6744F', '#7B4628', '#522D19'] },
  ven: { hue: 317.6, accent: '#B989C9', deep: '#694674', wash: '#F7EBFB', skyTop: '#F3E0FA', skyBottom: '#FFF3F9', spark: '#A8C99D', steps: ['#FCF9FD', '#F8F3FA', '#F7EBFB', '#F4E5F9', '#EFDBF6', '#EAD0F2', '#DAB7E6', '#C89DD6', '#B989C9', '#9F73AD', '#694674', '#462D4D'] },
  sta: { hue: 229.6, accent: '#4EAAD2', deep: '#0D5E7B', wash: '#E0F3FE', skyTop: '#CEEEFE', skyBottom: '#F2F7FF', spark: '#E4B196', steps: ['#F7FBFD', '#EFF7FB', '#E0F3FE', '#D6F0FC', '#C8E9FA', '#B7E2F8', '#92D0ED', '#6DBADE', '#4EAAD2', '#3C91B6', '#0D5E7B', '#083E52'] },
  ced: { hue: 31.2, accent: '#D78575', deep: '#7E4237', wash: '#FFEBE6', skyTop: '#FFE0D9', skyBottom: '#FFF5ED', spark: '#87CAD7', steps: ['#FEF9F8', '#FCF3F1', '#FFEBE6', '#FFE4DE', '#FEDAD2', '#FCCEC5', '#F2B4A8', '#E3998B', '#D78575', '#BA6F62', '#7E4237', '#542B23'] },
  press: { hue: 122.8, accent: '#92A95D', deep: '#4D5D23', wash: '#ECF3E1', skyTop: '#E3EDD0', skyBottom: '#F0FAF2', spark: '#C6B3E4', steps: ['#FAFBF7', '#F4F7EF', '#ECF3E1', '#E7EFD7', '#DEE8CA', '#D4E1BA', '#BCCE98', '#A4B977', '#92A95D', '#7C904B', '#4D5D23', '#323D15'] },
  curr: { hue: 10.3, accent: '#D6828F', deep: '#7D404A', wash: '#FFEAEC', skyTop: '#FFDFE2', skyBottom: '#FFF4F0', spark: '#88CDC8', steps: ['#FEF9FA', '#FCF3F4', '#FFEAEC', '#FFE3E6', '#FED8DD', '#FCCCD2', '#F2B2BA', '#E397A1', '#D6828F', '#B96D79', '#7D404A', '#542930'] },
  gress: { hue: 279.0, accent: '#9097DF', deep: '#4C5084', wash: '#ECEFFF', skyTop: '#E2E6FF', skyBottom: '#FAF4FF', spark: '#C9BF8B', steps: ['#FAFAFE', '#F4F5FC', '#ECEFFF', '#E6E9FF', '#DDE1FF', '#D2D7FF', '#BBC1F6', '#A2A9E9', '#9097DF', '#7A80C1', '#4C5084', '#313458'] },
  ag: { hue: 144.2, accent: '#74AF74', deep: '#366236', wash: '#E6F5E6', skyTop: '#D8EFD8', skyBottom: '#EDFAF6', spark: '#D5AFD7', steps: ['#F8FBF8', '#F2F7F1', '#E6F5E6', '#DFF1DE', '#D3EBD2', '#C6E4C4', '#A9D3A7', '#8BBF8A', '#74AF74', '#609660', '#366236', '#224122'] },
  gen: { hue: 45.7, accent: '#D48965', deep: '#7C452B', wash: '#FFEBE2', skyTop: '#FFE1D3', skyBottom: '#FDF6EC', spark: '#8CC8E0', steps: ['#FEF9F8', '#FCF4F0', '#FFEBE2', '#FEE5D9', '#FCDBCC', '#FAD0BD', '#F0B79D', '#E09D7E', '#D48965', '#B77353', '#7C452B', '#532D1B'] },
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
