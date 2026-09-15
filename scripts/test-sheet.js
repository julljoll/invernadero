async function test() {
  const res = await fetch('https://docs.google.com/spreadsheets/d/1flk-st-27PIKnTmO2q0KzUnGUR2RSdnvWXiupKHD8uE/edit?usp=sharing');
  const html = await res.text();
  console.log('Status:', res.status);
  console.log('Includes canEdit:', html.includes('canEdit'));
  console.log('Includes anonymous:', html.includes('anonymous'));
  const canEditMatches = html.match(/"canEdit":\s*(true|false)/g);
  console.log('canEdit matches:', canEditMatches);
}
test();
