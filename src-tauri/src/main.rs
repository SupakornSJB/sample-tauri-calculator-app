// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, sum, calculator])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command(rename="snake_case")]
fn sum(the_number: i32) -> i32 {
    let mut result: i32 = 0;
    for i in 0..the_number {
        result += i;
    }
    result
}

#[tauri::command]
fn calculator(num1: i32, num2: i32, op: &str) -> i32 {
   match op {
    "+" => num1 + num2,
    "-" => num1 - num2,
    "*" => num1 * num2,
    "/" => num1 / num2,
    _ => num1
   } 
}
