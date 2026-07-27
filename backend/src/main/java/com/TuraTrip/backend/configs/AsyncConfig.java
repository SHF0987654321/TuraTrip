package com.TuraTrip.backend.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public TaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        // Hilos que siempre se mantendrán vivos esperando tareas
        executor.setCorePoolSize(2);

        // Cantidad máxima de hilos que pueden crearse bajo alta demanda
        executor.setMaxPoolSize(5);

        // Capacidad de la cola de espera antes de activar nuevos hilos
        executor.setQueueCapacity(50);

        // Prefijo para identificar los hilos en tus logs de la terminal
        executor.setThreadNamePrefix("TuraTripAsync-");

        executor.initialize();
        return executor;
    }
}
