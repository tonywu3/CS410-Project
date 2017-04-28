from lxml import html
import requests
import json

page = requests.get('https://pokemondb.net/pokedex/national')
tree = html.fromstring(page.content)

pokemon = tree.xpath('//a[@class="ent-name"]/text()')
smallElement = tree.xpath('//small[@class="aside"]')

pokemonList = []
typeList = []

for pokemon in pokemon:
	# print(pokemon.encode('utf-8'))
	pokemonList.append(pokemon.encode('utf-8'))

#Types are in a list of either size 1 or 2
for typings in smallElement:
	# print(typings.xpath('a/text()'))
	types = typings.xpath('a/text()')
	typeList.append(types)

for i in range(0, 802):
	print(pokemonList[i])
	print(typeList[i])
