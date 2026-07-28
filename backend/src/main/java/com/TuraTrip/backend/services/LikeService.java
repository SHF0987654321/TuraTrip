package com.TuraTrip.backend.services;

import com.TuraTrip.backend.dtos.response.LikeResponse;

public interface LikeService {

    LikeResponse toggleLike(Long publicacionId, String correoUsuario);

}
