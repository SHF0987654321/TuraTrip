package com.TuraTrip.backend.services;

import com.TuraTrip.backend.exceptions.UsuarioNoEncontradoException;
import com.TuraTrip.backend.models.Usuario;
import com.TuraTrip.backend.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ImagenPerfilServiceImpl implements ImagenPerfilService {

    private final UsuarioRepository usuarioRepository;
    private final StorageService storageService;

    /**
     * POST /api/v1/usuarios/perfil/foto
     * Sube una imagen, la guarda en almacenamiento y actualiza el campo fotoPerfil. (SUG-70)
     *
     * @return URL pública de la imagen guardada.
     */
    @Override
    @Transactional
    public String subirFoto(String correo, MultipartFile archivo) {
        // 1. Obtener el usuario
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        // 2. Si el usuario ya tenía una foto anterior, eliminarla del almacenamiento
        if (usuario.getFotoPerfil() != null && !usuario.getFotoPerfil().isBlank()) {
            storageService.eliminarArchivo(usuario.getFotoPerfil());
        }

        // 3. Guardar el nuevo archivo (devuelve la ruta relativa ej. "perfiles/uuid.jpg")
        String rutaRelativa = storageService.guardarArchivo(archivo, "perfiles");

        // 4. Actualizar usuario con la ruta relativa en BD
        usuario.setFotoPerfil(rutaRelativa);
        usuarioRepository.save(usuario);

        // 5. Devolver la URL pública dinámica al cliente
        return storageService.construirUrlPublica(rutaRelativa);
    }
}
