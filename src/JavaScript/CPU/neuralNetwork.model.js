import { lerp } from "../utils";

class NeuralNetwork {
  constructor(neurons) {
    this.layers = [];
    for (let i = 0; i < neurons.length - 1; i++) {
      this.layers.push(new Layer(neurons[i], neurons[i + 1]));
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Layer.feedForward(givenInputs, network.layers[0]);
    for (let i = 1; i < network.layers.length; i++) {
      outputs = Layer.feedForward(outputs, network.layers[i]);
    }
    return outputs;
  }

  static mutate(network, amount = 1) {
    network.layers.forEach((layer) => {
      for (let i = 0; i < layer.biases.length; i++) {
        layer.biases[i] = lerp(layer.biases[i], Math.random() * 2 - 1, amount);
      }
      for (let i = 0; i < layer.weights.length; i++) {
        for (let j = 0; j < layer.weights[i].length; j++) {
          layer.weights[i][j] = lerp(
            layer.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }

  // Reconstruct a NeuralNetwork instance from a plain object
  static fromJSON(obj) {
    if (!obj || !Array.isArray(obj.layers)) return null;
    const nn = Object.create(NeuralNetwork.prototype);
    nn.layers = obj.layers.map(Layer.fromJSON);
    return nn;
  }
}

class Layer {
  constructor(inputNeurons, outputNeurons) {
    this.inputs = new Array(inputNeurons);
    this.outputs = new Array(outputNeurons);
    this.biases = new Array(outputNeurons);

    this.weights = [];
    for (let i = 0; i < inputNeurons; i++) {
      this.weights[i] = new Array(outputNeurons);
    }
    Layer.#randomize(this);
  }

  static #randomize(layer) {
    for (let i = 0; i < layer.inputs.length; i++) {
      for (let j = 0; j < layer.outputs.length; j++) {
        layer.weights[i][j] = Math.random() * 2 - 1;
      }
    }
    for (let i = 0; i < layer.biases.length; i++) {
      layer.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs, layer) {
    for (let i = 0; i < layer.inputs.length; i++) {
      layer.inputs[i] = givenInputs[i];
    }

    for (let i = 0; i < layer.outputs.length; i++) {
      let sum = 0;

      for (let j = 0; j < layer.inputs.length; j++) {
        sum += layer.inputs[j] * layer.weights[j][i];
      }

      // Activation function: simple step function
      if (sum > layer.biases[i]) {
        layer.outputs[i] = 1;
      } else {
        layer.outputs[i] = 0;
      }
    }

    return layer.outputs;
  }

  // Reconstruct a Layer instance from a plain object
  static fromJSON(obj) {
    if (!obj) return null;
    const layer = Object.create(Layer.prototype);
    layer.inputs = Array.isArray(obj.inputs) ? [...obj.inputs] : [];
    layer.outputs = Array.isArray(obj.outputs) ? [...obj.outputs] : [];
    layer.biases = Array.isArray(obj.biases) ? [...obj.biases] : [];
    layer.weights = Array.isArray(obj.weights)
      ? obj.weights.map((row) => [...row])
      : [];
    return layer;
  }
}

export default NeuralNetwork;
