import * as time from '@/scripts/time'

export const competitorPosition = (competitor) => {
  if (competitor.errors === '') return competitor.position
  else return ''
}

export const courseTable = (course, results) => `
  <div class="course">
    <h2>${course.name}</h2>
    <p>${course.length / 1000}km ${course.climb}m</p>
    <table>
      <tr>
        <th>Pos.</th>
        <th>Name</th>
        <th class="ageClass">Age Class</th>
        <th class="club">Club</th>
        <th>Time</th>
      </tr>
      ${results}
    </table>
  </div>
`
export const resultRow = (competitor) => `
    <tr>
      <td>${competitorPosition(competitor)}</td>
      <td>${competitor.name || ''}</td>
      <td class="ageClass">${competitor.ageClass || ''}</td>
      <td class="club">${competitor.club || ''}</td>
      <td>${time.displayTime(competitor.time, competitor.errors)}</td>
    </tr>
`

export const htmlPage = (eventInfo, body) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${eventInfo.name} - Results</title>
    <style>${style()}</style>
    <meta name="theme-color" content="#1976d2"/>
  </head>
  <body>
    <header>
      <h1>${eventInfo.name}</h1>
    </header>
    <main>
      ${body}
    </main>
    <footer>
      <p>Created at ${new Date()
        .toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '')} by Nevis </p>
    </footer>
  </body>
</html>
`

export const style = () => `
  html,
  body {
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
    padding: 0;
  }

  header {
    background-color: #1976d2;
    color: white;
    width: 100%;
    text-align: center;
  }

  header h1 {
    margin: 0;
    padding: 0.5rem 0;
  }

  footer {
    width: 100%;
    text-align: center;
    padding: 0.5rem 0;
    font-weight: bold;
    margin-top: 0.5rem;
  }

  main {
    width: 80%;
    margin-left: 10%;
  }

  main h2,
  main p {
    margin: 0.5rem 0;
  }

  main .course {
    margin: 1rem 0 1.5rem;
  }

  table {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
  }

  td,
  th {
    padding: 0.5rem 0.25rem;
  }

  tr {
    transition: 0.3s;
  }

  tr:nth-child(even) {
    background: #e3f2fd;
  }

  tr:hover {
    background: #bbdefb;
  }

  @media (max-width: 600px) {
    .club {
      display: none;
    }
    main {
      width: 90%;
      margin-left: 5%;
    }
  }

  @media (max-width: 400px) {
    .ageClass {
      display: none;
    }
  }
`
