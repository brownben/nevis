import time from './time.js'

export default {
  head: (eventName) => `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>html,body,p,a,td,th,h1,h2,h3,h4,h5,h6{margin:0;padding:0;font-weight:300;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif}h1,h2,h3,h4,h5,h6{color:#0d47a1;font-weight:400}header{background-color:#0d47a1;text-align:center;}header h1{padding:.25rem 0;color:#fff;font-size:2rem}main{padding:1rem 5%;width:90%}h2{padding:.25rem 0;font-size:2rem}p{padding:.25rem 0;font-size:1.15rem}table{margin-top:1rem;width:100%;border-collapse:collapse;text-align:center}td{padding:5px}th{padding:5px;font-weight:400}tr:nth-child(even){background-color:#e3f2fd}tr:hover{background-color:#bbdefb;transition:.3s}footer{padding:.5rem 0;color:#0d47a1;text-align:center;font-size:1.1rem}@media (max-width:500px){.club{padding:0;width:0;height:0;font-size:0}}@media (max-width:375px){.class{padding:0;width:0;height:0;font-size:0}}</style>
    <title>Results - ${eventName}</title>
  </head>

  <body>
    <header>
      <h1>Results - ${eventName}</h1>
    </header>
    <main>
  `,

  course: (course, results, multiPage = false) => {
    if (multiPage) {
      return `
      <div class="course">
        <h2>${course.name}</h2>
        <p>Length: ${course.length}km Climb: ${course.climb}m</p>
        <a href="./index.html">Return to Index</a>
        <table>
          <tr>
            <th>Pos.</th>
            <th>Name</th>
            <th class="club">Club</th>
            <th class="class">Age Class</th>
            <th>Time</th>
          </tr>
          ${results}
        </table>
      </div>
    `
    }
    else {
      return `
      <div class="course">
        <h2>${course.name}</h2>
        <p>Length: ${course.length}km Climb: ${course.climb}m</p>
        <table>
          <tr>
            <th>Pos.</th>
            <th>Name</th>
            <th class="club">Club</th>
            <th class="class">Age Class</th>
            <th>Time</th>
          </tr>
          ${results}
        </table>
      </div>
    `
    }
  },

  tableRow: (competitor) => `
  <tr>
    <td>${competitor.position}</td>
    <td>${competitor.name}</td>
    <td class="club">${competitor.club}</td>
    <td class="class">${competitor.ageClass}</td>
    <td>${time.displayTime(competitor.result)}</td>
  </tr>
  `,

  footer: () => `
  </main>
  <footer>
    <p>Created at ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')} by Nevis </p>
  </footer>
  </body>
  </html>
  `,
}
