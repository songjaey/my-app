#include <iostream>
#include <windows.h>

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " <nodeCount> <elementCount>" << std::endl;
        return 1;
    }

    int nodeCount = std::stoi(argv[1]);
    int elementCount = std::stoi(argv[2]);

    std::cout << "{" << std::endl;
    std::cout << "  \"nodeCount\": " << nodeCount << "," << std::endl;
    std::cout << "  \"elementCount\": " << elementCount << std::endl;
    std::cout << "}" << std::endl;
    Sleep(2000);

    return 0;
}