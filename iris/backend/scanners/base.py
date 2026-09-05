from abc import ABC, abstractmethod
from typing import List, Any
from models.schemas import Signal

class BaseScanner(ABC):
    @abstractmethod
    def analyze(self, input_data: Any) -> List[Signal]:
        """
        Takes raw input for the scanner modality and returns a list of standardized Signal objects.
        """
        pass
