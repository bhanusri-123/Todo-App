package com.todo.app.controller;

import com.todo.app.dto.TodoDto;
import com.todo.app.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TodoController {

    private final TodoService todoService;

    
    @PostMapping
    public ResponseEntity<TodoDto.Response> createTodo(@Valid @RequestBody TodoDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(todoService.createTodo(request));
    }

   
    @GetMapping
    public ResponseEntity<List<TodoDto.Response>> getAllTodos(
            @RequestParam(required = false) Boolean completed) {
        return ResponseEntity.ok(todoService.getAllTodos(completed));
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<TodoDto.Response> getTodoById(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.getTodoById(id));
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<TodoDto.Response> updateTodo(
            @PathVariable Long id,
            @RequestBody TodoDto.UpdateRequest request) {
        return ResponseEntity.ok(todoService.updateTodo(id, request));
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }
}
