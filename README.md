# sistema-alertas

El codigo está en la rama master. 

Instalar las dependencias con npm i y luego levantar con npm run start:dev. Para correr los test por entidad ejecutar: npm test 'nombreEntidad'.service, ej: npm test usuario.service.

Dejo también la query pedida: 
SELECT C.ID, C.NOMBRE, C.Apellido FROM Clientes C
INNER JOIN Ventas V
ON C.ID = V.Id_cliente
WHERE V.Fecha >= DATEADD(MONTH, -12, GETDATE())
GROUP BY C.ID, C.Nombre, C.Apellido
HAVING SUM(V.importe) > 100000
