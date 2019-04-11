import time from './time.js'

export default {
  head: (eventName) => `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>
    html,body,p,a,td,th,h1,h2,h3,h4,h5,h6{margin:0;padding:0;font-weight:300;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif}h1,h2,h3,h4,h5,h6{color:#0d47a1;font-weight:400}header{background-color:#0d47a1;text-align:center}header h1{padding:.25rem 0;color:#fff;font-size:2rem}main{padding:.5rem 5%;width:90%}h2{padding:.25rem 0;font-size:2rem}p{padding:.25rem 0;font-size:1.15rem}table{overflow-x:auto;margin-top:1rem;min-width:100%;border-collapse:collapse;text-align:center;}table.splits td{padding:0;font-size:15px}td{padding:5px 0;}td span{display:block;font-size:14px}th{padding:5px 0;font-weight:400}tr:nth-child(even){background-color:#e3f2fd}tr:hover{background-color:#bbdefb;transition:.3s}footer{padding:.5rem 0;color:#0d47a1;text-align:center;}footer p{font-size:.8rem}@media print{header{background-color:#fff;color:#000;text-align:left;}header h1{color:#000;font-size:1.75rem}h1,h2,h3,h4,h5,h6{padding:0;color:#000;font-size:1.5rem}a{display:none}main{padding:.5rem 0;width:100%}tr:not(:last-child){border-bottom:1px solid #d0d0d0}footer{color:#000}}
    </style>
    <title>Results - ${eventName}</title>
    <meta name="theme-color" content="#0D47A1"/>
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
            <th>Club</th>
            <th>Age Class</th>
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
            <th>Club</th>
            <th>Age Class</th>
            <th>Time</th>
          </tr>
          ${results}
        </table>
      </div>
    `
    }
  },

  splitsCourse: (course, results) => `
  <div class="course">
    <h2>${course.name} - Splits</h2>
    <p>Length: ${course.length}km Climb: ${course.climb}m</p>
    <a href="./index.html">Return to Index</a>
    <table class="splits">
      ${results}
    </table>
  </div>
  `,

  tableRow: competitor => `
  <tr>
    <td>${competitor.position}</td>
    <td>${competitor.name}</td>
    <td>${competitor.club}</td>
    <td>${competitor.ageClass}</td>
    <td>${time.displayTime(competitor.result)}</td>
  </tr>
  `,

  splitsTableRow: (competitor, lengthOfSplits) => {
    const requiredSplits = competitor.splits.filter(split => split.number !== '*')

    const base = `
    <tr>
      <td>${competitor.position}</td>
      <td>${competitor.name}</td>
      <td>${competitor.club}</td>
      <td>${competitor.ageClass}</td>
      <td>${time.displayTime(competitor.result)}</td>
    `
    let splitText = ''
    let noOfSplits = 0
    for (const split of requiredSplits) {
      splitText += `
      <td>
        <span>${time.displayTime(split.splitTime) || '--:--'}</span>
        <span>${time.displayTime(split.elapsedTime) || '--:--'}</span>
      </td>`
      noOfSplits += 1
    }
    while (noOfSplits < (lengthOfSplits + 1)) {
      splitText += `
      <td>
        <span>&nbsp;</span>
        <span>&nbsp;</span>
      </td>`
      noOfSplits += 1
    }

    return base + splitText + '</tr>'
  },

  footer: () => `
  </main>
  <footer>
    <p>Created at ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')} by Nevis </p>
  </footer>
  </body>
  </html>
  `,
}
