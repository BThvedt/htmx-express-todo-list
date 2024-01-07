import ejs from "ejs"

const renderFile = (file, data) => {
  return new Promise((resolve) => {
    ejs.renderFile(file, data, (err, result) => {
      if (err) {
        console.log(err)
      }
      resolve(result)
    })
  })
}

export default renderFile
