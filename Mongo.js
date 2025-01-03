require('dotenv').config();
const { MongoClient, ObjectId } = require("mongodb");
const generateEmbedding = require('./embedding');
class MongoDBHandler {
  constructor() {
    const url= process.env.MONGO_URL;
    this.dbName="QueykSearch";
    this.client = new MongoClient(url);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Conexión exitosa a MongoDB");
      this.db = this.client.db(this.dbName);
      this.collectionTT=this.db.collection("TT");
      this.collectionUsers=this.db.collection("Users");
      this.collectionDirectors=this.db.collection("Directors")
    } catch (error) {
      console.error("Error al conectar con MongoDB:", error);
      throw error;
    }
  }

  // Cerrar la conexión
  async close() {
    try {
      await this.client.close();
      console.log("Conexión cerrada con MongoDB");
    } catch (error) {
      console.error("Error al cerrar la conexión:", error);
    }
  }



  // INsertar el documento a la coleccion, la generacion del embedding se genera al insertarlo mediante un trigger de
  //mongo 
  // SI JALA 
  async insertOneTT(document) {
    try {
      const result = await this.collectionTT.insertOne(document);
      console.log(`Documento insertado con ID: ${result.insertedId}`);
      return result;
    } catch (error) {
      console.error("Error al insertar documento:", error);
      throw error;
    }
  }
  async insertManyTT( ) {
    try {
        let conteo = 0;
        for (const document of documents) {
            await this.insertOneTT(document);
            conteo++;
        }
        console.log(`${conteo} documentos insertados con éxito.`);
        return { conteo };
    } catch (error) {
        console.error("Error al insertar múltiples documentos:", error);
        throw error;
    }
}

  ////no mas para obtener todos los tetes 
  async findAllTTs() {
    try {
      const documents = await this.collectionTT.find(
        {}, 
        {
          projection: {
            plot_embedding: 0
          },
        }
      ).toArray();
      return documents;
    } catch (error) {
      console.error("Error al obtener documentos:", error);
      throw error;
    }
  }

  async findTTById(id) {
    try {
      const document = await this.collectionTT.findOne({ _id: new ObjectId(id) },{
        projection:{
          plot_embedding:0,
        }
      });
      return document;
    } catch (error) {
      console.error("Error al obtener documento por ID:", error);
      throw error;
    }
  }

  // Actualizar un documento por ID
  /// NO JALA tan bien como tal solo se le mete el nuevo documento al mismo id 
  async updateTTById(id, updateData) {
    try {
      const result = await this.collectionTT.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      console.log(`Documentos actualizados: ${result.modifiedCount}`);
      return result;
    } catch (error) {
      console.error("Error al actualizar documento:", error);
      throw error;
    }
  }


  async deleteTTById(id) {
    try {
      const result = await this.collectionTT.deleteOne({ _id: new ObjectId(id) });
      console.log(`Documentos eliminados: ${result.deletedCount}`);
      return result;
    } catch (error) {
      console.error("Error al eliminar documento:", error);
      throw error;
    }
  }

  // aqui empieza lo bueno

  //  se obtienen los tts dea cuerdo a una query
  // si jala 
  async findTTsByQuery(query) {
    try {
      const embedding = await generateEmbedding(query);// se genera el embedding con la otra clase  
      if (!embedding) {
        console.log("No se pudo generar el embedding.");
        return [];
      }
      console.log("Embedding generado.");
  
      const agg = [
        {
          $vectorSearch: {
            index: "vector_index_resumen",
            path: "plot_embedding",
            queryVector: embedding,
            numCandidates: 40,
            limit: 4,
          },
        },
        {
          $project: {
            _id: 0,
            titulo: 1,
            resumen: 1,
            documentoUrl: 1,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ];
  
      const results = await this.collectionTT.aggregate(agg).toArray();
      return results;
    } catch (error) {
      console.error("Error en findTTsByQuery:", error);
      throw error;
    }
  } 

  // encontrar palabras por medio de una palabra clave
  //Si jala 
  async findTTsByKeyWord(KeyWord) {
    try {
        // Configura la consulta de Atlas Search
        const pipeline = [
            {
                $search: {
                    index: "KeyWords", // Reemplaza con el nombre de tu índice Atlas Search si es diferente
                    text: {
                        path: "palabrasClave",
                        query: KeyWord,
                        fuzzy: {
                            maxEdits: 2, 
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    titulo: 1,
                    resumen: 1,
                    palabrasClave: 1,
                    score: { $meta: "searchScore" } // Incluye el puntaje de relevancia (opcional)
                }
            }
        ];
        const results = await this.collectionTT.aggregate(pipeline).toArray();
        if(results.length==0){
          console.log("no hay documentos parecidos mi parcerito, te la retorno vacia");
        }
        return results;
    } catch (error) {
        console.error("Error al buscar documentos con palabras clave:", error);
        throw error;
    }
  }



  //  encontrar tts mediante un arreglo de palabras 
  //si jala
  async findTTsByKeyWords(keyWords) {
    try {
      const pipeline = [
        {
          $search: {
            index: "KeyWords", // Reemplaza con el nombre de tu índice Atlas Search si es diferente
            compound: {
              should: keyWords.map((word) => ({
                text: {
                  path: "palabrasClave",
                  query: word,
                  fuzzy: { maxEdits: 2 },
                },
              })),
              minimumShouldMatch: 1,
            },
          },
        },
        {
          $project: {
            _id: 1,
            titulo: 1,
            resumen: 1,
            palabrasClave: 1,
            score: { $meta: "searchScore" },
          },
        },
      ];
  
      // Ejecuta el pipeline y retorna los resultados
      const results = await this.collectionTT.aggregate(pipeline).toArray();
  
      if (results.length === 0) {
        console.log("no hay papito");
        return [];
      }
      return results;
    } catch (error) {
      console.error("Error al buscar documentos con palabras clave:", error);
      throw error;
    }
  }
  
  /// busqueda mediante varios parametrso los que jalan titulo,autor, UA, directorgrado
//faltan creo el de palabras clave junto al año de publicacion 
  async findTTsBusquedaAvanzada(params){

    if (Object.keys(params).length === 0) {
        console.log("no puede haber param vacios");
        return;
    }
    try {
      const pipeline = [];
  
      const searchQuery = {
        index: "All-in", 
        compound: { should: [] }
      };
      if (params.titulo) {
        searchQuery.compound.should.push({
          text: {
            query: params.titulo,
            path: "titulo",
            fuzzy: { maxEdits: 2 }
          }
        });
      }
  
      if (params.autor) {
        searchQuery.compound.should.push({
          text: {
            query: params.autor,
            path: "autores.nombreCompleto"
          }
        });
      }
  
      if (params.unidadAcademica) {
        searchQuery.compound.should.push({
          term: {
            query: params.unidadAcademica,
            path: "unidadAcademica"
          }
        });
      }
  
      if (params.grado) {
        searchQuery.compound.should.push({
          term: {
            query: params.grado,
            path: "grado"
          }
        });
      }
  
      if (params.palabrasClave) {
        searchQuery.compound.should.push({
          terms: {
            query: params.palabrasClave,
            path: "palabrasClave"
          }
        });
      }
      
      if(params.director){
        searchQuery.compound.should.push({
          text:{
            query:params.director,
            path:"directores.nombreCompleto"
          }
        })
      }
  
      if (params.anoPublicacion) {
        searchQuery.compound.should.push({
          range: {
            path: "fechaPublicacion",
            gte: params.anoPublicacion
          }
        });
      }
  
      pipeline.push({ $search: searchQuery });
  
      // Filtros adicionales con $match después de $search
      if (params.anoPublicacion) {
        pipeline.push({
          $match: {
            anoPublicacion: { $gte: params.anoPublicacion }
          }
        });
      }
      const projection  = {
          _id: 0,
          plot_embedding: 0,
          score: { $meta: "searchScore" },
        }

      pipeline.push({$project: projection});
      
      console.dir(pipeline,{depth:null})
      // Ejecutar el pipeline
      const resultados = await this.collectionTT.aggregate(pipeline).toArray();
      console.dir(resultados,{depth:null})
    } catch(error) {
      console.error("erorr", error)
    }
  }  

  
  async findTTsByFilters(filters) {
    try {
      // Construimos dinámicamente el filtro
      const query = {};
  
      // Si el filtro tiene un título, lo incluimos en la búsqueda
      if (filters.titulo) {
        query.titulo = { $regex: filters.titulo, $options: "i" }; // Búsqueda insensible a mayúsculas/minúsculas
      }
  
      // Si el filtro tiene directores, lo incluimos
      if (filters.directores) {
        query.directores = { $in: filters.directores }; // Busca coincidencias en la lista de directores
      }
  
      // Si el filtro tiene palabras clave
      if (filters.palabrasClave) {
        query.palabrasClave = { $in: filters.palabrasClave }; // Busca que todas las palabras clave estén presentes
      }
  
      // Si el filtro tiene unidad académica
      if (filters.unidadAcademica) {
        query.unidadAcademica = { $regex: filters.unidadAcademica, $options: "i" }; // Insensible a mayúsculas
      }
  
      // Ejecutamos la búsqueda con el filtro dinámico
      const results = await this.collectionTT.find(query).toArray();
  
      console.log("Documentos encontrados:", results);
      return results;
    } catch (error) {
      console.error("Error al buscar con filtros dinámicos:", error);
      throw error;
    }
  }
  



  // USUARIOSSSSSSZzzzz
  async insertUser(document){
    try {
      const result = await this.collectionUsers.insertOne(document);
      console.log(`Usuario ingresado  con ID: ${result.insertedId}`);
      return result;
    } catch (error) {
      console.error("Error al insertar nuevo usuario:", error);
      throw error;
    }
  }
  async findAllUsers(){
    try {
      const resultado = await  this.collectionUsers.find().toArray();
      console.log("se retorno");
      return resultado;
    } catch (error) {
      console.log.error(error);
    }
  }

  async findUserById(userId) {
    try {
      const usuario = await this.collectionUsers.findOne({ _id: new ObjectId(userId) });
      if(!usuario){
        console.log('Usuario no encontrado');
      }
      return usuario;
    } catch (error) {
      console.error("Error al obtener usuario por ID:", error);
      throw error;
    }
  }
  async findHistorialByUserId(user_id){
    try {
      const documentoHistorial = await this.collectionUsers.findOne(
        { _id: new ObjectId(user_id) },
        {projection: { historial:1,_id:0 } });
      if(!documentoHistorial){
        console.log('Usuario no encontrado o historial vacio');
      }
      return documentoHistorial;
    } catch (error) {
      console.error("Error al obtener documento por ID:", error);
      throw error;
    }
  }
  async addHistorial(userId, nuevoTT) {
    try {
      const result = await this.collectionUsers.updateOne(
        { _id: new ObjectId(userId) },
        {
          $push: {
            historial: {
              titulo: nuevoTT.titulo,
              unidadAcademica: nuevoTT.unidadAcademica,
              documentoUrl: nuevoTT.documentoUrl,
            },
          },
        }
      );
      if (result.matchedCount === 0) {
        throw new Error("Usuario no encontrado");
      }
      console.log( await this.findHistorialByUserId(userId));
      return { success: true, message: "Historial actualizado correctamente" };
    } catch (error) {
      console.error("Error al agregar al historial:", error.message);
      return { success: false, error: error.message };
    }
  }
  





  async findRolById(user_id) {
    try {
      const documentoHistorial = await this.collectionUsers.findOne(
        { _id: new ObjectId(user_id) },
        { projection: { rol: 1, _id: 0 } }
      );
      return documentoHistorial.rol ;
    } catch (error) {
      console.error("Error al obtener el rol por ID:", error);
      throw error;
    }
  }

  async updateUser(userId, updates) {
    try {
      const result = await this.collectionUsers.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updates }
      );
      console.log(`Usuario con ID ${userId} actualizado.`);
      return result;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  }

  async deleteUserById(userId) {
    try {
      const result = await this.collectionUsers.deleteOne({ _id: new ObjectId(userId) });
      return result;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  }
  async setRoleById(userId, role) {
    try {
      const result = await this.collectionUsers.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { rol: role } }
      );
      return result;
    } catch (error) {
      console.error("Error al agregar rol:", error);
      throw error;
    }
  }
}

 





module.exports = MongoDBHandler;