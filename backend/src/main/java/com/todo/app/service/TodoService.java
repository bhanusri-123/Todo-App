package com.todo.app.service;

import com.todo.app.dto.TodoDto;
import com.todo.app.exception.ResourceNotFoundException;
import com.todo.app.model.Todo;
import com.todo.app.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TodoService {

    private final TodoRepository todoRepository;


    private TodoDto.Response toResponse(Todo todo) {
        return TodoDto.Response.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .description(todo.getDescription())
                .completed(todo.getCompleted())
                .createdAt(todo.getCreatedAt())
                .build();
    }


    public TodoDto.Response createTodo(TodoDto.CreateRequest request) {
        Todo todo = Todo.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .completed(false)
                .build();
        return toResponse(todoRepository.save(todo));
    }


    @Transactional(readOnly = true)
    public List<TodoDto.Response> getAllTodos(Boolean completed) {
        List<Todo> todos = (completed != null)
                ? todoRepository.findByCompletedOrderByCreatedAtDesc(completed)
                : todoRepository.findAllByOrderByCreatedAtDesc();
        return todos.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public TodoDto.Response getTodoById(Long id) {
        return todoRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
    }


    public TodoDto.Response updateTodo(Long id, TodoDto.UpdateRequest request) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            todo.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            todo.setDescription(request.getDescription().trim());
        }
        if (request.getCompleted() != null) {
            todo.setCompleted(request.getCompleted());
        }

        return toResponse(todoRepository.save(todo));
    }


    public void deleteTodo(Long id) {
        if (!todoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Todo not found with id: " + id);
        }
        todoRepository.deleteById(id);
    }
}
