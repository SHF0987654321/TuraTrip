public interface PerfilService {

    PerfilResponse obtenerPerfil(String correo);

    PerfilResponse editarPerfil(
        String correo,
        EditarPerfilRequest request
    );
}