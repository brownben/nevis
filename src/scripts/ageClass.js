export default {
  fromYearAndGender: (dateOfBirth, gender) => {
    const date = new Date()
    const currentYear = date.getFullYear()
    let year = ''
    if (dateOfBirth.split('/').length === 3) year = dateOfBirth.split('/')[2]
    else year = dateOfBirth
    const age = currentYear - parseInt(year)
    let ageClass = ''
    if (gender.replace(/"/g, '') === 'f') ageClass += 'W'
    else if (gender.replace(/"/g, '') === 'm') ageClass += 'M'
    if (age <= 10) ageClass += '10'
    else if (age <= 12) ageClass += '12'
    else if (age <= 14) ageClass += '14'
    else if (age <= 16) ageClass += '16'
    else if (age <= 18) ageClass += '18'
    else if (age <= 20) ageClass += '20'
    else if (age >= 21) ageClass += '21'
    else if (age >= 35) ageClass += '35'
    else if (age >= 40) ageClass += '40'
    else if (age >= 45) ageClass += '45'
    else if (age >= 50) ageClass += '50'
    else if (age >= 55) ageClass += '55'
    else if (age >= 60) ageClass += '60'
    else if (age >= 65) ageClass += '65'
    else if (age >= 70) ageClass += '70'
    else if (age >= 75) ageClass += '75'
    else if (age >= 80) ageClass += '80'
    else if (age >= 85) ageClass += '85'
    else if (age >= 90) ageClass += '90'
    else if (age >= 95) ageClass += '95'
    else if (age >= 100) ageClass += '100'
    return ageClass
  },
}
