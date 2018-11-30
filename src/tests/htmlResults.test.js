import htmlResults from '../scripts/htmlResults'

test('Head', () => {
  expect(htmlResults.head('Test')).toBe(`
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>html,body,p,a,td,th,h1,h2,h3,h4,h5,h6{margin:0;padding:0;font-weight:300;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif}h1,h2,h3,h4,h5,h6{color:#0d47a1;font-weight:400}header{background-color:#0d47a1;text-align:center;}header h1{padding:.25rem 0;color:#fff;font-size:2rem}main{padding:1rem 5%;width:90%}h2{padding:.25rem 0;font-size:2rem}p{padding:.25rem 0;font-size:1.15rem}table{margin-top:1rem;width:100%;border-collapse:collapse;text-align:center}td{padding:5px}th{padding:5px;font-weight:400}tr:nth-child(even){background-color:#e3f2fd}tr:hover{background-color:#bbdefb;transition:.3s}footer{padding:.5rem 0;color:#0d47a1;text-align:center;font-size:1.1rem}@media (max-width:500px){.club{padding:0;width:0;height:0;font-size:0}}@media (max-width:375px){.class{padding:0;width:0;height:0;font-size:0}}</style>
    <title>Results - Test</title>
  </head>

  <body>
    <header>
      <h1>Results - Test</h1>
    </header>
    <main>
  `)

  expect(htmlResults.head('')).toBe(`
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>html,body,p,a,td,th,h1,h2,h3,h4,h5,h6{margin:0;padding:0;font-weight:300;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif}h1,h2,h3,h4,h5,h6{color:#0d47a1;font-weight:400}header{background-color:#0d47a1;text-align:center;}header h1{padding:.25rem 0;color:#fff;font-size:2rem}main{padding:1rem 5%;width:90%}h2{padding:.25rem 0;font-size:2rem}p{padding:.25rem 0;font-size:1.15rem}table{margin-top:1rem;width:100%;border-collapse:collapse;text-align:center}td{padding:5px}th{padding:5px;font-weight:400}tr:hover{background-color:#bbdefb;transition:.3s}tr:nth-child(odd){background-color:#e3f2fd}footer{padding:.5rem 0;color:#0d47a1;text-align:center;font-size:1.1rem}@media (max-width:500px){.club{padding:0;width:0;height:0;font-size:0}}@media (max-width:375px){.class{padding:0;width:0;height:0;font-size:0}}</style>
    <title>Results - </title>
  </head>

  <body>
    <header>
      <h1>Results - </h1>
    </header>
    <main>
  `)
})

test('Course', () => {
  expect(htmlResults.course({
    name: 'Long',
    length: '5.3',
    climb: '25',
  }, 'Results Go Here')).toBe(`
  <div class="course">
      <h2>Long</h2>
      <p>Length: 5.3km Climb: 25m</p>
      <table>
        <tr>
          <th>Pos.</th>
          <th>Name</th>
          <th class="club">Club</th>
          <th class="class">Age Class</th>
          <th>Time</th>
        </tr>
        Results Go Here
      </table>
    </div>
    `)
})

test('Table Row', () => {
  expect(htmlResults.tableRow({
    position: '3',
    name: 'Bob Jones',
    club: 'CAP',
    ageClass: 'M38',
    result: 2928,
  })).toEqual(`
  <tr>
    <td>3</td>
    <td>Bob Jones</td>
    <td class="club">CAP</td>
    <td class="class">M38</td>
    <td>48:48</td>
  </tr>
  `)
})

test('Footer', () => {
  expect(htmlResults.footer()).toEqual(`
  </main>
  <footer>
    <p>Created at ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')} by Nevis </p>
  </footer>
  </body>
  </html>
  `)
})
