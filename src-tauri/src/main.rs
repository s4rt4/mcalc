// Sembunyikan console window pada release build di Windows.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    m_calc_lib::run()
}
