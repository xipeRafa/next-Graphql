const courses = [
      {
          title: 'JavaScript --0',
          technology: 'JavaScript',
      },
      {
          title: 'React – MERN +15 Apps--1',
          technology: 'React',
      }
  ];

const resolvers = {
      Query:{ //this is in line 10
            //getCourses:()=> courses, //this is in the line 12 in schema.js
            //getTechnology:()=>courses ////this is in the line 13 in schema.js

            getCourses:(_,{input},ctx,info)=>{
                  console.log(ctx)
                  const result = courses.filter(el => el.technology === input.technology)
                  
                  return result
            }

            // _ --------- objeto que retorna el resolver padre para consultas anidadas en graphql
            // {input} --- input argumentos 
            // ctx ------  objeto que se comparte entre todos los resolvers
            // info -----  informacion sobre la consulta actual
      }
}
module.exports=resolvers