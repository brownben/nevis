export default (gender, yearOfBirth) => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const age = parseInt(currentYear) - parseInt(yearOfBirth)

  let ageClass = ''

  if (gender === 'f') ageClass += 'W'
  else ageClass = 'M'

  if (age === currentYear) return ''
  else if (age <= 10) ageClass += '10'
  else if (age <= 12) ageClass += '12'
  else if (age <= 14) ageClass += '14'
  else if (age <= 16) ageClass += '16'
  else if (age <= 18) ageClass += '18'
  else if (age <= 20) ageClass += '20'
  else if (age >= 100) ageClass += '100'
  else if (age >= 95) ageClass += '95'
  else if (age >= 90) ageClass += '90'
  else if (age >= 85) ageClass += '85'
  else if (age >= 80) ageClass += '80'
  else if (age >= 75) ageClass += '75'
  else if (age >= 70) ageClass += '70'
  else if (age >= 65) ageClass += '65'
  else if (age >= 60) ageClass += '60'
  else if (age >= 55) ageClass += '55'
  else if (age >= 50) ageClass += '50'
  else if (age >= 45) ageClass += '45'
  else if (age >= 40) ageClass += '40'
  else if (age >= 35) ageClass += '35'
  else ageClass += '21'

  return ageClass
}
