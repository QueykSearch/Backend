

const { MongoCryptAzureKMSRequestError } = require("mongodb");
const MongoDBHandler = require("./Mongo");
const dbHandler = new MongoDBHandler();

async function main() {
  try {
    // Conectar al cliente
    await dbHandler.connect();

    // Insertar un documento
    const nuevoDoc = [{
      "titulo": "Detección de Enfermedades en Plantas con Redes Neuronales Convolucionales",
      "autores": [
        {
          "nombreCompleto": "José García López",
          "orcid": "0000-0001-2345-6789"
        },
        {
          "nombreCompleto": "Ana Rodríguez Pérez",
          "orcid": "null"
        }
      ],
      "palabrasClave": ["IA", "Agricultura", "Redes Neuronales"],
      "unidadAcademica": "Facultad de Ciencias Agrícolas",
      "directores": [
        {
          "directorId": 2,
          "nombreCompleto": "Dr. Miguel Ángel Torres"
        }
      ],
      "grado": "Ingeniería en Biotecnología",
      "resumen": "Este trabajo explora el uso de redes neuronales convolucionales para detectar enfermedades en cultivos agrícolas.",
      "documentoUrl": "https://storage.googleapis.com/tt_documents/tt_5678.pdf",
      "fechaPublicacion": "2020-11-12T00:00:00Z"
     }
     //,
    // {
    //   "titulo": "Optimización de Rutas para Delivery con Algoritmos Genéticos",
    //   "autores": [
    //     {
    //       "nombreCompleto": "Luis Hernández Rivera",
    //       "orcid": "0000-0003-4567-8901"
    //     },
    //     {
    //       "nombreCompleto": "Clara Domínguez Ortiz",
    //       "orcid": "null"
    //     }
    //   ],
    //   "palabrasClave": ["Optimización", "Algoritmos Genéticos", "Logística"],
    //   "unidadAcademica": "Facultad de Ingeniería Industrial",
    //   "directores": [
    //     {
    //       "directorId": 3,
    //       "nombreCompleto": "Dra. Sofía Morales Vázquez"
    //     }
    //   ],
    //   "grado": "Ingeniería en Sistemas",
    //   "resumen": "Propuesta de optimización de rutas para sistemas de delivery utilizando algoritmos genéticos como modelo base.",
    //   "documentoUrl": "https://storage.googleapis.com/tt_documents/tt_7890.pdf",
    //   "fechaPublicacion": "2022-03-20T00:00:00Z"
    // },
    // {
    //   "titulo": "Reconocimiento de Actividad Humana en Cámaras de Vigilancia",
    //   "autores": [
    //     {
    //       "nombreCompleto": "Pedro Martínez Ruiz",
    //       "orcid": "0000-0002-9876-5432"
    //     },
    //     {
    //       "nombreCompleto": "Elena Torres García",
    //       "orcid": "null"
    //     }
    //   ],
    //   "palabrasClave": ["Video vigilancia", "Redes Neuronales", "Reconocimiento"],
    //   "unidadAcademica": "Facultad de Electrónica",
    //   "directores": [
    //     {
    //       "directorId": 4,
    //       "nombreCompleto": "Dr. Francisco Gómez Díaz"
    //     }
    //   ],
    //   "grado": "Ingeniería en Electrónica",
    //   "resumen": "Estudio de redes neuronales para identificar patrones de actividad humana en entornos de seguridad.",
    //   "documentoUrl": "https://storage.googleapis.com/tt_documents/tt_2345.pdf",
    //   "fechaPublicacion": "2021-09-30T00:00:00Z"
    // }
    ];
    
    //const insertar=await dbHandler.insertOneTT(nuevoDoc);
    // const insertarMuchos = await dbHandler.insertManyTT(nuevoDoc);

  

    // const TTs = await dbHandler.findAllTTs();
    // console.log(TTs);

    //  const nuevoHistorial = await dbHandler.findTTById('675d006d74a31471a7515c66');
    //  console.log(nuevoHistorial);

    //  const usuarios = await dbHandler.findAllUsers();
    //  console.log(usuarios);

    const usuarioId= '67428866c8526ddfff49ff40';
    // usuario = await dbHandler.findUserById(usuarioId);
    // console.log(usuario);

     const historialUsuario = await dbHandler.findHistorialByUserId(usuarioId);
     console.log(historialUsuario);    



    //   nuevoHistorial={ 
    //     titulo:"Análisis de Algoritmos en Inteligencia Artificial",
    //     resumen:"Facultad de Ingeniería",
    //     documentoUrl:"marin.com"
    //     }
    //  const TTId = '675d006d74a31471a7515c66'
    //  TTReconociementoActividadHumana= await dbHandler.findTTById('675d006d74a31471a7515c66');
    //  const historialAdded = await dbHandler.addHistorial(usuarioId,TTReconociementoActividadHumana)



    //  const query="medicina y aplicacion de la IA en los hospitales" ;
    // const TTsQuery = await dbHandler.findTTsByQuery(query);
    // console.log(TTsQuery);


    // const KeyWord='machimburri';
    // const ttsKeyword = await dbHandler.findTTsByKeyWord(KeyWord);
    // console.log(ttsKeyword);

    // const KeyWords=['Redes','Social','Maquinea'];
    // const ttsKeywords = await dbHandler.findTTsByKeyWord(KeyWords);
    // console.log(ttsKeywords);



    //await dbHandler.deleteUserById('6741fbf59c41f121620aa98e');
    //await dbHandler.setRoleById('6741fbf59c41f121620aa98e',"Academico");


    // const filtros = {

    //   //"directores": ["Dr. Francisco Gómez Díaz"],
    //   "palabrasClave": ["Redes", "Neuronales"],
    //   "unidadAcademica": "Facultad de Electrónica"
    // }
    
    // const filtrados = await  dbHandler.findTTsByFilters(filtros);


    const filters = {
      titulo: "Reconocimiento",
      autor: "Pedro",
      //unidadAcademica: "Chimbirimambini",
     // director:"Martinez",
      //grado: "Maestría",
      // palabrasClave: ["Video vigilancia", "Reconocimiento"],
      // anoPublicacion: 202//
      // limit: 5,
      // page: 1
  };

    const filtradosBusqudaAvaznada = await dbHandler.findTTsBusquedaAvanzada(filters)
  // const losfiltrados=await dbHandler.findTTsByKeyWordsAndFilters(filters)
  // console.log(losfiltrados)
  } catch (error) {
    console.error("Error en el programa principal:", error);
  } finally {
    // Cerrar la conexión
    await dbHandler.close();
  }
}

main();
