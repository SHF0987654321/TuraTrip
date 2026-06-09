package com.TuraTrip.backend.models;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tokens")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TipoToken tipo;

    @Column(nullable = false)
    private LocalDateTime fechaExpiracion;

    private boolean usado;

    public boolean estaExpirado() {
        return LocalDateTime.now().isAfter(this.fechaExpiracion) || this.usado;
    }
}