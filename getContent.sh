#!/bin/bash

# Define el directorio de origen y el archivo de salida
DIRECTORIO="src/"
SALIDA="archivos.txt"

# Vacía el archivo de salida si ya existe
> "$SALIDA"

# Encuentra todos los archivos .ts dentro de src/ excluyendo node_modules/
find "$DIRECTORIO" -type f -name "*.ts" -not -path "*/node_modules/*" | while read -r archivo; do
    # Añade la ruta del archivo como comentario al inicio
    echo "// Backend/$archivo" >> "$SALIDA"
    
    # Añade el contenido del archivo
    cat "$archivo" >> "$SALIDA"
    
    # Añade una línea en blanco para separar los archivos
    echo "\n\n" >> "$SALIDA"
done

echo "Se ha creado '$SALIDA' con las rutas y contenidos de los archivos .ts."
