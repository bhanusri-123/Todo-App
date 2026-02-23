package com.todo.app;

import com.todo.app.model.Todo;
import com.todo.app.repository.TodoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TodoApplication {

    public static void main(String[] args) {
        SpringApplication.run(TodoApplication.class, args);
    }

    @Bean
    CommandLineRunner seedData(TodoRepository repo) {
        return args -> {
            repo.save(Todo.builder().title("Setup Spring Boot project").description("Initialize Maven project with required dependencies").completed(true).build());
            repo.save(Todo.builder().title("Design database schema").description("Define entity models and relationships for the todo app").completed(true).build());
            repo.save(Todo.builder().title("Implement REST API").description("Create controller, service and repository layers").completed(false).build());
            repo.save(Todo.builder().title("Build React frontend").description("Implement UI components with hooks and Axios integration").completed(false).build());
            repo.save(Todo.builder().title("Write unit tests").description("Test coverage for all service layer methods, target 80%").completed(false).build());
        };
    }
}
